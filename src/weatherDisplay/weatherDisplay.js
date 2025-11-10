import weatherDisplayContent from "./weatherDisplay.html";

export default function displayWeatherData(locationData, weatherData) {
    const weatherDisplay = document.createElement("div");
    weatherDisplay.insertAdjacentHTML("afterbegin", weatherDisplayContent);

    const DOMIds = [
        "locationName",
        "temperature",
        "apparentTemperature",
        "precipitation",
        "is_day",
        "rain",
    ];
    const textContents = [
        locationData.name,
        `Temperature: ${weatherData.current.temperature_2m} °C`,
        `Apparent Temperature: ${weatherData.current.apparent_temperature} °C`,
        `Precipitation: ${weatherData.current.precipitation} mm`,
        `Is Day: ${weatherData.current.is_day ? "Yes" : "No"}`,
        `Rain: ${weatherData.current.rain} mm`,
    ];

    DOMIds.forEach((id, index) => {
        const element = weatherDisplay.querySelector(`#${id}`);
        if (element) {
            element.textContent = textContents[index];
        }
    });

    const forecastContainer =
        weatherDisplay.querySelector("#forecastContainer");
    if (forecastContainer) {
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            const weatherDay = document.createElement("div");
            weatherDay.classList.add("weatherDay");

            const dayTitle = document.createElement("h4");
            dayTitle.classList.add("day");
            dayTitle.textContent = new Date(
                weatherData.daily.time[i]
            ).toLocaleDateString();
            weatherDay.appendChild(dayTitle);

            const minTemp = document.createElement("p");
            minTemp.classList.add("temperature");
            minTemp.textContent = `Min Temperature: ${weatherData.daily.temperature_2m_min[i]} °C`;
            weatherDay.appendChild(minTemp);

            const maxTemp = document.createElement("p");
            maxTemp.classList.add("temperature");
            maxTemp.textContent = `Max Temperature: ${weatherData.daily.temperature_2m_max[i]} °C`;
            weatherDay.appendChild(maxTemp);

            forecastContainer.appendChild(weatherDay);
        }
    }

    return weatherDisplay;
}
