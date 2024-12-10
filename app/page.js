'use client'

import { useState, useEffect } from 'react';
import { Search, RefreshCw, ThermometerSun, Wind, Droplets } from "lucide-react";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed To Fetch The weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!searchCity.trim()) return;
    
    try {
      setLoading(true);
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();
      
      if (!geoData.results?.[0]) {
        throw new Error('City Indvalid');
      }

      const { latitude, longitude, name } = geoData.results[0];
      await fetchWeatherByCoords(latitude, longitude);
      setSearchCity(name);
    } catch (err) {
      setError(err.message === 'City not found' ? 'City not found. Please Try Another Location.' : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Unable to get location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle',
      53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain',
      63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow',
      73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
      80: 'Slight rain showers', 81: 'Moderate rain showers',
      82: 'Violent rain showers', 95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="text-white text-lg">Loading weather data...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeatherByCity()}
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={fetchWeatherByCity}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          >
            <Search size={24} />
          </button>
        </div>


        {weather && (
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={getCurrentLocation}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
              >
                <RefreshCw size={24} />
              </button>
              <button
                onClick={() => setIsCelsius(!isCelsius)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                Switch to {isCelsius ? '°F' : '°C'}
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {searchCity || 'Current Location'}
              </h1>
              <div className="flex items-center justify-center gap-2 text-6xl font-bold text-gray-900 mb-4">
                <ThermometerSun size={48} />
                {isCelsius ? 
                  `${Math.round(weather.current.temperature_2m)}°C` :
                  `${Math.round(weather.current.temperature_2m * 9/5 + 32)}°F`
                }
              </div>
              <div className="text-gray-700">
                {getWeatherDescription(weather.current.weather_code)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Droplets size={20} />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-semibold">
                  {weather.current.relative_humidity_2m}%
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Wind size={20} />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-semibold">
                  {Math.round(weather.current.wind_speed_10m)} {weather.current_units.wind_speed_10m}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}