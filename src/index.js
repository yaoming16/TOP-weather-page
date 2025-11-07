import "./style.css";

import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": -34.9033,
	"longitude": -56.1882,
	"current": ["temperature_2m", "apparent_temperature", "precipitation"],
	"timezone": "auto",
};

async function getFormattedWeatherData(url, params) {
    let weatherDataResponse;
    try { 
        if (!url || !params) throw new Error("URL or parameters are missing.");
        weatherDataResponse = await fetchWeatherApi(url, params);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
    
    weatherDataResponse = weatherDataResponse[0];
    
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
    
const weatherUrl = "https://api.open-meteo.com/v1/forecast";
const weatherData = await getFormattedWeatherData(weatherUrl, params);
if (weatherData !== null) {
    console.log(weatherData);
}

let city = "Montevideo";
const locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;


// Need to check this function 
async function getFormattedLocationData(url, userSelectedCity) {

    try {
        let locationDataResponse = await fetch(url);
        locationDataResponse = await locationDataResponse.json();
        locationDataResponse = locationDataResponse.results[0];
        if (!locationDataResponse) throw new Error("Location not found");
        return {
            latitude: locationDataResponse.latitude,
            longitude: locationDataResponse.longitude,
            name: locationDataResponse.name,
        };
    } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
    }

}






//https://open-meteo.com/en/docs?bounding_box=null,null,null,null&latitude=-34.9033&longitude=-56.1882&timezone=auto&hourly=&current=temperature_2m,apparent_temperature,precipitation
//https://open-meteo.com/en/docs/geocoding-api