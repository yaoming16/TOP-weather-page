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

    return weatherDisplay;
}
