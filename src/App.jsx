import { useEffect, useState } from 'react'
import searchIcon from './assets/search_icon.svg'
import clearIcon from './assets/clear_weather_icon.svg'
import drizzleIcon from './assets/drizzle_rain_weather_icon.svg'
import rainIcon from './assets/rain_weather_icon.svg'
import snowIcon from './assets/snow.png'
import humidityIcon from './assets/humidity_icon.svg'
import windIcon from './assets/wind_weather_icon.svg'
import './App.css'

function WeatherDetails(props) {
  return (
    <>
      <div className='image'>
        <img src={props.weatherIcon} alt='weather-img' />
      </div>
      <div className='temp'>
        <p>{props.temp}°C</p>
      </div>
      <div className='city'>
        <p>{props.city}</p>
      </div>
      <div className='country'>
        <p>{props.country}</p>
      </div>
      <div className='cord'>
        <div className='latitude'>
          <span>{props.latitude}</span>
          <span> latitude</span>
        </div>
        <div className='longitude'>
          <span>{props.longitude}</span>
          <span>longitude</span>
        </div>
      </div>
      <div className='dataContainer'>
        <div className='humidity'>
          <img src={humidityIcon} alt='humidity-img' />
          <span>{props.humidity}%</span>
          <span>humidity</span>
        </div>
        <div className='wind'>
          <img src={windIcon} alt='wind-img' />
          <span>{props.wind}mph</span>
          <span>Wind</span>
        </div>
      </div>
    </>
  )
}

function App() {
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [text, setText] = useState("Chennai");
  const [cityNotFound, setcityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": clearIcon,
    "02n": clearIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }


  async function apiSearch() {
    setLoading(true);
    let api_key = "59954578ab7f0dad03f41748dff810d7";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    console.log(cityNotFound);
    try {
      let result = await fetch(url);
      let data = await result.json();
      console.log(data);
      if (data.cod === "404") {
        setcityNotFound(true);
        setLoading(false);
        return;
      }
      else {
        setcityNotFound(false);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLatitude(data.coord.lat);
        setLongitude(data.coord.lon);
        const weatherIconId = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconId] || clearIcon);
      }

    }
    catch (e) {
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching the data.");
    }
    finally {
      setLoading(false);
    }
  }
  function handleCity(e) {
    setText(e.target.value);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      apiSearch();
    }
  }
  useEffect(() => {
    apiSearch();
  }, [])

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type='text' className='cityinput' placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className='search-icon'>
            <img src={searchIcon} alt='search' onClick={() => apiSearch()} />
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails weatherIcon={icon} temp={temp} city={city} country={country} longitude={longitude} latitude={latitude} humidity={humidity} wind={wind} />}
        {loading && <div className='loading alert'>Loading...</div>}
        {error && <div className='error alert'>{error}</div>}
        {!loading && cityNotFound && <div className='city-not-found alert'>City not found</div>}
      </div>
    </>
  )
}

export default App
