import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Mumbai');

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    const url = `https://open-weather13.p.rapidapi.com/city/${city}/EN`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'a5ec288651msh447d2f01f41a0f2p140acfjsndd39f69dcb75',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok){
        throw new Error('City not found');
        
      } 

      const result = await response.json();
      
      if (!result.weather || result.weather.length === 0) {
        throw new Error('Weather data unavailable');
      }
      
      setWeatherData(result);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const toCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Weather</h2>
      <form onSubmit={handleFormSubmit} className="text-center mb-3">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
        <button type="submit" className="btn btn-primary mt-2">
          Get Weather
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {weatherData && (
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <h4>{weatherData.name} Weather</h4>
            <small className="text-capitalize">{weatherData.weather[0].description}</small>
          </div>
          <div className="card-body">
            <div className="text-center">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="img-fluid"
              />
            </div>
            <div className="row mt-3">
              <div className="col-md-6 text-center">
                <h5>Temperature (°C)</h5>
                <p>
                  Current: {toCelsius(weatherData.main.temp).toFixed(2)}°C <br />
                  Feels Like: {toCelsius(weatherData.main.feels_like).toFixed(2)}°C <br />
                  Min: {toCelsius(weatherData.main.temp_min).toFixed(2)}°C, Max: {toCelsius(weatherData.main.temp_max).toFixed(2)}°C
                </p>
              </div>
              <div className="col-md-6 text-center">
                <h5>Details</h5>
                <p>
                  Humidity: {weatherData.main.humidity}% <br />
                  Pressure: {weatherData.main.pressure} hPa <br />
                  Wind Speed: {weatherData.wind.speed} mph <br />
                  Wind Direction: {weatherData.wind.deg}°
                </p>
              </div>
            </div>
            <div className="text-center mt-3">
              <small>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</small> |
              <small> Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

