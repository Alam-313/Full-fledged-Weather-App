import React, { useState } from 'react';
import axios from 'axios';

const Weathercompo = () => {
  
  const [city, setCity] = useState('');
  const[cnt,setCnt]=useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const apiKey = 'c3e3bfb690635881aade3aa4c8d2071a';
  const [headerActive, setHeaderActive] = useState(false);

  function changecnt(){
    setCnt(cnt+1);
  }

  const getWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
      // Fetch 5-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      setForecastData(forecastResponse.data.list);
    } catch (err) {
      setWeatherData(null);
      setForecastData(null);
      setError('City not found. Please try again.');
    }
  };
  
  const calculateAverage = (temperatures) => {
    const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
    return Math.round(sum / temperatures.length);
  };
  

  const toggleHeaderActive = () => {
    
    if (event.target.tagName === 'BUTTON'&& cnt===0) {
      setHeaderActive(!headerActive);
      changecnt();
      console.log(cnt)
    }
  };

  return (
    <>
    <div className='container '>
      <div className={`header ${headerActive ? 'header-active' : ''}`} onClick={toggleHeaderActive}>
      <input
        className="custom-input"
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      
      <button onClick={getWeatherData}>Get Weather</button>


      </div>
      <div className='div22'>

      {weatherData && (
        <div className='cdata'>
        <h2>Current Weather in {weatherData.name}</h2>
        <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
            style={{ width: '100px', height: '100px' }}
          />
        <div className='mdiv'>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Min Temperature: {weatherData.main.temp_min}°C</p>
          <p>Max Temperature: {weatherData.main.temp_max}°C</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>Wind Direction: {weatherData.wind.deg}°</p>
          
        </div>
        </div>
      )}

      {forecastData && (
        <div className='alma'>
          {forecastData.reduce((uniqueDates, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const description = item.weather[0].description;

            if (!uniqueDates.find((entry) => entry.date === date)) {
                uniqueDates.push({
                  date: date,
                  temperatures: [item.main.temp],
                  description: description,
                  wind: {
                    speed: item.wind.speed,
                    direction: item.wind.deg,
                  },
                  icon: item.weather[0].icon,
                });
              } else {
                const existingEntry = uniqueDates.find((entry) => entry.date === date);
                existingEntry.temperatures.push(item.main.temp);
              }
              return uniqueDates;
          }, []).map((entry) => (
            <div key={entry.date} className='abcd'>
              <p>Date: {entry.date}</p>
              <p>Description: {entry.description}</p>
              <p>Temperature: {calculateAverage(entry.temperatures)}°C</p>
              <p>Wind Speed: {entry.wind.speed} m/s</p>
              <p>Wind Direction: {entry.wind.direction}°</p>
              {/* Display weather icon for each date */}
              <img
                src={`http://openweathermap.org/img/w/${entry.icon}.png`}
                alt="Weather Icon"
                style={{ width: '50px', height: '50px' }}
              />
              {/* Add other forecast details here if needed */}
            </div>
          ))}
          
        </div>
        
        
      )}
      

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>

    </>
  );
  
};

export default Weathercompo;
