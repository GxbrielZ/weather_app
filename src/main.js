async function getWeather() {
    const city = document.getElementById("city").value;

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const coordinates = await getCoordinates(city);

    if (!coordinates) {
        alert("Failed to get coordinates for the city!");
        return;
    }

    const weatherData = await getWeatherData(coordinates.lat, coordinates.lon);

    if (!weatherData) {
        alert("Failed to get weather data!");
        return;
    }

    displayWeather(weatherData);
}

async function getCoordinates(city) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`;

    try {
        const response = await fetch(geoApiUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch coordinates!");
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error("City not found!");
        }

        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getWeatherData(lat, lon) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl)}`);

        if (!response.ok) {
            throw new Error("Failed to fetch data!");
        }

        const json = await response.json();
        const data = JSON.parse(json.contents);

        return {
            name: `Weather at lat ${lat}, lon ${lon}`,
            description: data.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
            temperature: data.properties.timeseries[0].data.instant.details.air_temperature,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weather-result");
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.description}</p>
        <p>Temperature: ${data.temperature}°C</p>
    `;
}

document.querySelector("button").addEventListener("click", getWeather);