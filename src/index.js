import "./style.css";

import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": -34.9033,
	"longitude": -56.1882,
	"current": ["temperature_2m", "apparent_temperature", "precipitation"],
	"timezone": "auto",
};

async function fetchData(url, params) {
    try {
        const response = await fetchWeatherApi(url, params);
        return response;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function getFormattedWeatherData(url, params) {
    let weatherDataResponse = await fetchData(url, params);
    
    if (weatherDataResponse === null) {
        console.log("Failed to retrieve weather data.");
        return -1;
    } else {
        weatherDataResponse = weatherDataResponse[0];
    }
    
    const utcOffsetSeconds = weatherDataResponse.utcOffsetSeconds();
    const current = weatherDataResponse.current();
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0).value(),
            apparent_temperature: current.variables(1).value(),
            precipitation: current.variables(2).value(),
        },
    };
    return weatherData;
}
    
    const url = "https://api.open-meteo.com/v1/forecast";
    const weatherData = await getFormattedWeatherData(url, params);
    if (weatherData !== -1) {
        console.log(weatherData);
    }
