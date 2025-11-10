import "./style.css";

import displayWeatherData from "./weatherDisplay/weatherDisplay.js";
import {
    getFormattedWeatherData,
    getFormattedLocationData,
} from "./functions.js";

const params = {
    latitude: undefined,
    longitude: undefined,
    forecast_days: 7,
    current: [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "is_day",
        "rain",
    ],
    timezone: "auto",
    daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_min",
        "apparent_temperature_max",
    ],
};

const weatherUrl = "https://api.open-meteo.com/v1/forecast";

// Form submit event
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");

weatherForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userSelectedCity = cityInput.value.trim().toLowerCase();

    // If no value is entered in the input field show an error
    if (!userSelectedCity || userSelectedCity.length === 0) {
        console.error("No city selected");
        cityInput.classList.add("input-error");
        return;
    } else {
        cityInput.classList.remove("input-error");
    }

    // Get location data based on user input
    const locationData = await getFormattedLocationData(userSelectedCity);

    //Set params based on location data
    if (locationData) {
        params.latitude = locationData.latitude;
        params.longitude = locationData.longitude;
    }

    // Get weather data based on location data
    const weatherData = await getFormattedWeatherData(weatherUrl, params);
    if (weatherData !== null) {
        // Display the weather data on the page
        const weatherDisplayHTML = displayWeatherData(
            locationData,
            weatherData
        );
        const weatherDisplayContainer = document.getElementById(
            "weatherDisplayContainer"
        );

        while (weatherDisplayContainer.firstChild) {
            weatherDisplayContainer.removeChild(
                weatherDisplayContainer.firstChild
            );
        }

        weatherDisplayContainer.appendChild(weatherDisplayHTML);
    }
});

//https://open-meteo.com/en/docs?bounding_box=null,null,null,null&latitude=-34.9033&longitude=-56.1882&timezone=auto&hourly=&current=temperature_2m,apparent_temperature,precipitation
//https://open-meteo.com/en/docs/geocoding-api
