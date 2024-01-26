const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = "094b545dde613af5667ba10639a224f8"; // Replace with your actual API key

  try {
    // Use OpenWeatherMap Geocoding API to get coordinates based on city name
    const geocodingAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse = await axios.get(geocodingAPIUrl);
    const { lat, lon } = geoResponse.data[0];

    // Use the obtained coordinates to fetch weather data
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherAPIUrl);
    const weather = weatherResponse.data;

    // Fetch currency exchange rates
    const EXCHANGE_API_KEY = "626f6398f362ed160eecee98"; // Replace with your actual ExchangeRate-API key
    const exchangeAPIUrl = `https://open.er-api.com/v6/latest?apikey=${EXCHANGE_API_KEY}`;
    const exchangeResponse = await axios.get(exchangeAPIUrl);
    const exchangeRates =  {
      KZT: exchangeResponse.data.rates.KZT,
      USD: exchangeResponse.data.rates.USD,
    };

    // Fetch cryptocurrency data
    const COINGECKO_API_KEY = "CG-gGFdGKAyTTYgPDffzyKy6h7Q"; // Replace with your actual CoinGecko API key
    const cryptoAPIUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
    const cryptoResponse = await axios.get(cryptoAPIUrl);
    const cryptoData = cryptoResponse.data;

    res.render("index", { weather, exchangeRates, cryptoData });
  } catch (error) {
    res.render("index", { weather: null, error: "Error, Please try again" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
