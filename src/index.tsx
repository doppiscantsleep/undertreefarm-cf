import 'dotenv/config';
import { Hono } from 'hono';
import { renderer } from './renderer';

const weatherapi = process.env.OPENWEATHER_KEY;
const theURL =
  "http://api.openweathermap.org/data/2.5/weather?id=4996956&units=imperial&appid=" + weatherapi;

interface WeatherData {
  weather: { description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number; deg: number };
}

const getStuff = async () => {
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
  const weatherData = await getStuff(); // Call getStuff here

  // Determine the image to display based on the description
  const weatherImage =
    weatherData.desc === "clear sky"
      ? `<img src="/clear-sky.png" alt="Clear Sky" style="width: 50px; height: 50px; margin-left: 10px;">`
      : "";


      return c.html(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Undertree Farm</title>
          <link rel="icon" type="image/png" href="/favicon.png">
          <style>
            body {
              margin: 0;
              font-family: sans-serif;
              background-color: #f3f3f3;
              display: flex;
              flex-direction: column; /* Stack elements vertically */
              justify-content: flex-start; /* Align elements at the top */
              align-items: center; /* Center elements horizontally */
              height: 100vh;
              overflow: hidden;
              position: relative;
            }
            img {
              width: 250px; /* Adjust size of the favicon */
              margin-top: 20px; /* Add spacing at the top */
            }
            .bee {
              position: fixed;
              width: 40px;
              height: 40px;
              background-image: url('/bee.png');
              background-size: contain;
              background-repeat: no-repeat;
              pointer-events: none;
              transition: transform 0.05s linear;
              top: 0;
              left: 0;
            }
      #weather {
        margin-top: -60px; /* Add spacing below the favicon */
        text-align: center; /* Center-align the weather information */
        font-size: 0.8rem; /* Make the font smaller */
      }
          </style>
        </head>
        <body>
          <img src="/favicon.png" alt="Undertree Farm logo">
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