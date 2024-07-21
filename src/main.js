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

    const weatherData = await getWeatherData(coordinates.lat, coordinates.lon, city);

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

async function getWeatherData(lat, lon, city) {
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
            name: `Weather in ${city}`,
            description: data.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
            temperature: data.properties.timeseries[0].data.instant.details.air_temperature,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getWeatherIcon(symbolCode) {
    const iconMap = {
        clearsky_day: "☀️ Clear Day",
        clearsky_night: "🌕 Clear Night",
        fair_day: "🌤️ Fair Day",
        fair_night: "🌕🌤️ Fair Night",
        cloudy: "☁️ Cloudy",
        partlycloudy_day: "⛅ Partly Cloudy Day",
        partlycloudy_night: "🌤️ Partly Cloudy Night",
        rain: "🌧️ Rainy",
        lightrain: "🌦️ Light Rain",
        heavyrain: "🌧️🌧️ Heavy Rain",
        heavyrainshowers_day: "🌧️☀️ Heavy Rainshowers Day",
        heavyrainshowers_night: "🌧️🌕 Heavy Rainshowers Night",
        lightrainshowers_day: "🌦️☀️ Light Rainshowers Day",
        lightrainshowers_night: "🌦️🌕 Light Rainshowers Night",
        snow: "❄️ Snow",
        lightsnow: "🌨️ Light Snow",
        heavysnow: "❄️❄️ Heavy Snow",
        thunderstorm: "⛈️ Thunderstorm",
        fog: "🌫️ Fog",
        sleet: "🌨️🌧️ Sleet",
        hail: "🌨️ Hail",
        wind: "🌬️ Wind",
        mist: "🌫️ Mist",
        drizzle: "🌦️ Drizzle",
        smoke: "🌫️ Smoke",
        dust: "🌪️ Dust",
    };

    return iconMap[symbolCode] || symbolCode;
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weather-result");
    const icon = getWeatherIcon(data.description);

    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p class='weather-data'>${icon}</p>
        <p class='weather-data'>Temperature: ${data.temperature}°C</p>
    `;
}

document.querySelector("button").addEventListener("click", getWeather);