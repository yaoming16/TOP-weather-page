import { fetchWeatherApi } from "openmeteo";

export async function getFormattedWeatherData(url, params) {
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
    const daily = weatherDataResponse.daily();
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0).value(),
            apparent_temperature: current.variables(1).value(),
            precipitation: current.variables(2).value(),
            is_day: current.variables(3).value(),
            rain: current.variables(4).value(),
        },
        daily: {
            time: Array.from(
                {
                    length:
                        (Number(daily.timeEnd()) - Number(daily.time())) /
                        daily.interval(),
                },
                (_, i) =>
                    new Date(
                        (Number(daily.time()) +
                            i * daily.interval() +
                            utcOffsetSeconds) *
                            1000
                    )
            ),
            temperature_2m_max: daily.variables(0).valuesArray(),
            temperature_2m_min: daily.variables(1).valuesArray(),
            apparent_temperature_min: daily.variables(2).valuesArray(),
            apparent_temperature_max: daily.variables(3).valuesArray(),
        },
    };
    console.log("Formatted weather data:", weatherData);
    return weatherData;
}

export async function getFormattedLocationData(userSelectedCity) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${userSelectedCity}&count=1&language=en&format=json`;
    try {
        let locationDataResponse = await fetch(url);
        locationDataResponse = await locationDataResponse.json();
        console.log(locationDataResponse);
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
