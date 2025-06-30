import { useState, useEffect } from 'react'
import axios from 'axios'

export const CountryList = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => onShow(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

export const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY
  console.log('API key:', api_key);

  useEffect(() => {
    const capital = country.capital[0]
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      )
      .then(response => setWeather(response.data))
  }, [country, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area}</p>

      <h4>Languages:</h4>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}