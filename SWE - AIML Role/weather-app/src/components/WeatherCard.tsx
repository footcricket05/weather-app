import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Navigation } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{weather.name}</h2>
          <p className="text-gray-600">{weather.sys.country}</p>
        </div>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-16 h-16"
        />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</span>
          <span className="text-gray-600 capitalize">{weather.weather[0].description}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>L: {Math.round(weather.main.temp_min)}°C</span>
          <span>H: {Math.round(weather.main.temp_max)}°C</span>
        </div>
        <p className="text-gray-600 mt-1">Feels like {Math.round(weather.main.feels_like)}°C</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Wind className="text-blue-500" size={20} />
          <div>
            <p className="text-gray-700">{weather.wind.speed} m/s</p>
            <p className="text-sm text-gray-500">{getWindDirection(weather.wind.deg)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" size={20} />
          <div>
            <p className="text-gray-700">{weather.main.humidity}%</p>
            <p className="text-sm text-gray-500">Humidity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="text-blue-500" size={20} />
          <div>
            <p className="text-gray-700">{weather.main.pressure} hPa</p>
            <p className="text-sm text-gray-500">Pressure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="text-blue-500" size={20} />
          <div>
            <p className="text-gray-700">{getWindDirection(weather.wind.deg)}</p>
            <p className="text-sm text-gray-500">Wind Dir</p>
          </div>
        </div>
      </div>
    </div>
  );
};