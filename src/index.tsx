import 'dotenv/config';
import { Hono } from 'hono';
import { renderer } from './renderer';
import { getWeatherKey } from '../functions/env';

// comment out for prod
// const theURL = "http://api.openweathermap.org/data/2.5/weather?id=4996956&units=imperial&appid=" + process.env.OPENWEATHER_KEY;


interface WeatherData {
  weather: { description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number; deg: number };
}

const getStuff = async (context: any) => {

  // // comment out for local testing
  const weatherapi = await getWeatherKey(context);
  const theURL = `http://api.openweathermap.org/data/2.5/weather?id=4996956&units=imperial&appid=${weatherapi}`;

  const response = await fetch(theURL);
  const data: WeatherData = await response.json();

  const desc = data.weather[0]["description"];
  const temp = data.main.temp;
  const feels_temp = data.main.feels_like;
  const humi = data.main.humidity;
  const wind_speed = data.wind.speed;
  const wind_deg = data.wind.deg;

  return { desc, temp, feels_temp, humi, wind_speed, wind_deg };
};

const app = new Hono();

app.use(renderer);

app.get("*", async (c) => {
  const weatherData = await getStuff(c);

  // Determine the image to display based on the description
  const weatherImage =
    weatherData.desc === "clear sky"
      ? `<img src="/images/clear-sky.png" alt="Clear Sky" style="width: 50px; height: 50px; margin-left: 10px;">`
      : weatherData.desc.includes("rain")
        ? `<img src="/images/rain.png" alt="Rain" style="width: 50px; height: 50px; margin-left: 10px;">`
        : weatherData.desc.includes("thunderstorm")
          ? `<img src="/images/thunderstorm.png" alt="Thunderstorm" style="width: 50px; height: 50px; margin-left: 10px;">`
          : weatherData.desc.includes("overcast clouds")
            ? `<img src="/images/overcast-clouds.png" alt="Overcast Clouds" style="width: 50px; height: 50px; margin-left: 10px;">`
            : weatherData.desc.includes("snow")
              ? `<img src="/images/snow.png" alt="Snow" style="width: 50px; height: 50px; margin-left: 10px;">`
              : weatherData.desc.includes("scattered clouds")
                ? `<img src="/images/scattered-clouds.png" alt="Scattered clouds" style="width: 50px; height: 50px; margin-left: 10px;">`
                : weatherData.desc === "few clouds"
                  ? `<img src="/images/few-clouds.png" alt="Few Clouds" style="width: 50px; height: 50px; margin-left: 10px;">`
                  : "";


  return c.html(
    `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Undertree Farm</title>
          <link rel="icon" type="image/png" href="/images/favicon.png">
          <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
        <div id="arch">
        </div>
          <img src="/images/favicon.png" alt="Undertree Farm logo" class="logo">
          <div id="weather">
            <p>${weatherImage}</p>
            <p>Description: ${weatherData.desc}</p>
            <p>Temperature: ${weatherData.temp}°F</p>
            <p>Feels Like: ${weatherData.feels_temp}°F</p>
            <p>Humidity: ${weatherData.humi}%</p>
            <p>Wind Speed: ${weatherData.wind_speed} mph</p>
            <p>Wind Direction: ${weatherData.wind_deg}°</p>
          </div>
          <div class="bee" id="bee"></div>
          <script>
            const bee = document.getElementById('bee');
            document.addEventListener('mousemove', function(e) {
              if (bee) {
                const x = e.pageX - 20;
                const y = e.pageY - 20;
                bee.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
              }
            });
          </script>
        </body>
        </html>`
  );
});

export default app;