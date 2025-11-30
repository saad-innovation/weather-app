async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    result.innerHTML = "";
    loading.style.display = "block";

    try {
        // Step 1: Get coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            loading.style.display = "none";
            result.innerHTML = "❌ City not found";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Step 2: Get weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const weather = weatherData.current_weather;

        loading.style.display = "none";

        // Step 3: Map weather code to icon
        let icon = "🌤"; // default

        switch (weather.weathercode) {
            case 0: icon = "☀️"; break;
            case 1: icon = "🌤"; break;
            case 2: icon = "⛅️"; break;
            case 3: icon = "☁️"; break;
            case 45:
            case 48: icon = "🌫️"; break;
            case 51:
            case 53:
            case 55: icon = "🌦️"; break;
            case 61:
            case 63:
            case 65: icon = "🌧️"; break;
            case 71:
            case 73:
            case 75: icon = "❄️"; break;
            case 80:
            case 81:
            case 82: icon = "🌦️"; break;
            case 95:
            case 96:
            case 99: icon = "⛈️"; break;
        }


        // Step 4: Display result (icon centered)
        result.innerHTML = `
            <h3>${name}</h3>
            <div class="icon-wrapper">${icon}</div>
            <p>🌡 Temperature: ${weather.temperature}°C</p>
            <p>💨 Wind Speed: ${weather.windspeed} m/s</p>
        `;

    } catch (error) {
        loading.style.display = "none";
        result.innerHTML = "❌ Error fetching data";
        console.log(error);
    }
}
