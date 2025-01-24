import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { WeatherHistory } from './components/WeatherHistory';
import { DateRangeSearch } from './components/DateRangeSearch';
import { supabase } from './lib/supabase';
import type { WeatherData, ForecastData } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      console.log('Fetching weather for coordinates:', { lat, lon });
      const weatherUrl = `${import.meta.env.VITE_WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`;
      const forecastUrl = `${import.meta.env.VITE_WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.statusText}`);
      }
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json()
      ]);

      console.log('Weather data received:', weatherData);
      setWeather(weatherData);
      setForecast(forecastData);

      // Store the search in the database
      const { error: dbError } = await supabase
        .from('weather_searches')
        .insert({
          location: weatherData.name,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          temperature: {
            current: weatherData.main.temp,
            min: weatherData.main.temp_min,
            max: weatherData.main.temp_max,
            date: new Date().toISOString()
          }
        });

      if (dbError) {
        console.error('Error storing weather search:', dbError);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      throw new Error('Failed to fetch weather data');
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if input is coordinates
      const coordsMatch = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
      if (coordsMatch) {
        const [, lat, lon] = coordsMatch;
        await fetchWeatherData(parseFloat(lat), parseFloat(lon));
        return;
      }

      // Check if input is a ZIP code
      const zipMatch = query.match(/^\d{5,6}$/);
      if (zipMatch) {
        const zipUrl = `${import.meta.env.VITE_GEOCODING_API_URL}/zip?zip=${query},IN&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
        const zipResponse = await fetch(zipUrl);
        
        if (!zipResponse.ok) {
          throw new Error('Invalid ZIP code or not found');
        }
        
        const zipData = await zipResponse.json();
        if (!zipData.lat || !zipData.lon) {
          throw new Error('ZIP code not found');
        }
        
        await fetchWeatherData(zipData.lat, zipData.lon);
        return;
      }

      // Regular city search
      const geocodeUrl = `${import.meta.env.VITE_GEOCODING_API_URL}/direct?q=${encodeURIComponent(query)}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding API error: ${geocodeResponse.statusText}`);
      }
      
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('Location not found. Please try a different search term.');
      }
      
      const { lat, lon } = geocodeData[0];
      await fetchWeatherData(lat, lon);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('Geolocation position:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });

          const lat = Number(position.coords.latitude.toFixed(6));
          const lon = Number(position.coords.longitude.toFixed(6));

          await fetchWeatherData(lat, lon);
        } catch (err) {
          console.error('Geolocation error:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', {
          code: err.code,
          message: err.message
        });
        
        let errorMessage = 'Failed to get your location. ';
        switch (err.code) {
          case 1:
            errorMessage += 'Please enable location services in your browser.';
            break;
          case 2:
            errorMessage += 'Position unavailable. Please try again.';
            break;
          case 3:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'Please try again or enter location manually.';
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const handleDateRangeSearch = async (location: string, startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      await handleSearch(location);
    } catch (err) {
      console.error('Date range search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Weather App</h1>
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            title="About Product Manager Accelerator"
          >
            <Info size={24} />
          </a>
        </header>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full space-y-8">
            <SearchBar onSearch={handleSearch} onLocationRequest={handleLocationRequest} />
            <DateRangeSearch onSearch={handleDateRangeSearch} />
          </div>

          {loading && (
            <div className="text-gray-600">Loading weather data...</div>
          )}

          {error && (
            <div className="text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          )}

          {weather && <WeatherCard weather={weather} />}
          {forecast && <ForecastCard forecast={forecast} />}
          <WeatherHistory />
        </div>
      </div>
    </div>
  );
}

export default App;