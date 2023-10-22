import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Weather = ({ country }) => {
  const [temp, setTemp] = useState("");
  const [wind, setWind] = useState("");
  const [iconLink, setIconLink] = useState("");

  useEffect(() => {
    if (country !== null)
      weatherService
        .getAll(country.latlng[0], country.latlng[1])
        .then((response) => {
          const temperatureInCelsius = response.list[0].main.temp - 273.15;

          // Use toFixed to format temperature to 2 decimal places
          setTemp(temperatureInCelsius.toFixed(2));
          setWind(response.list[0].wind.speed);

          setIconLink(
            `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`
          );
        });
  });

  if (country === null) {
    return;
  }

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {temp} Celcius</div>
      <img src={iconLink} />
      <div>wind {wind} m/s</div>
    </div>
  );
};

export default Weather;
