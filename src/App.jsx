import { useEffect, useRef } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import WeatherCard from "./assets/components/WeatherCard";
import imageClame from "./util/imageClame";

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [country, setCountry] = useState("");
  const [ubicacion, setUbicacion] = useState([]);
  const [numImagen, setNumImagen] = useState(1);
  const [capitalCity, setCapitalCity] = useState('')

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/name/${country}`)
      .then((res) => {
        setUbicacion(res.data[0].latlng)
        setCapitalCity(res.data[0].capital[0])
        console.log(res.data)
      })
      .catch((err) => console.log(err));
  }, [country]);

  useEffect(() => {
    if (ubicacion.length > 0) {
      const API_KEY = "c1f53bef2ba36e5d1181b83d50fe8ffa";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ubicacion[0]}&lon=${ubicacion[1]}&appid=${API_KEY}`;
      axios.get(url)
        .then((res) => {
       
        const celsius = (res.data.main.temp - 273.15).toFixed(1);
        const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
        setTemp({ celsius, fahrenheit });
      
        setWeather(res.data);
        const numImagen = imageClame(celsius);
        setNumImagen(numImagen);
      })
      .catch(err => console.log(err));
    }
  }, [ubicacion]);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true);
    }, 3000);
    const success = (pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    };
    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => {
    if (coords) {
      const API_KEY = "c1f53bef2ba36e5d1181b83d50fe8ffa";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [coords]);

  const inputSearch = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCountry(inputSearch.current.value.trim());
  };

  const photoFondo = {
    backgroundImage: `url(/fondo${numImagen}.jpg)`,
  };

  return (
    <div className="app" style={photoFondo}>
      {
      isLoading ? (
        <div className="loading">
          <h2 className="loading__message">Loading....</h2>
          {showMessage && (
            <p>Por favor activa la ubicación para poder ver el clima local.</p>
          )}
        </div>)
        : hasError 
        ? (
            <h2 className="loading__message">
             Por favor permite la ubicación para poder ver el clima local.
            </h2>) 
        : (
          <WeatherCard weather={weather} temp={temp} capital ={capitalCity}/>
          )
      }
      <section className="section2">
        <h3 className="form__h3">Ver Clima de la Capital un País : </h3>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="form__input"
            ref={inputSearch}
            name="inputCountry"
            type="text"
           />
          <button className="form__button" type="submit">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
export default App;
