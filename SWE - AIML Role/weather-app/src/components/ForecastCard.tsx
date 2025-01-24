import React from 'react';
import type { ForecastData } from '../types/weather';

interface ForecastCardProps {
  forecast: ForecastData;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const getDayForecast = (list: ForecastData['list']) => {
    const dailyForecasts = new Map();
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, item);
      }
    });

    return Array.from(dailyForecasts.values()).slice(1, 6); // Next 5 days
  };

  const dayForecasts = getDayForecast(forecast.list);

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {dayForecasts.map((day) => (
          <div key={day.dt} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-12 h-12"
            />
            <p className="text-lg font-semibold">{Math.round(day.main.temp)}°C</p>
            <p className="text-sm text-gray-600 capitalize">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};