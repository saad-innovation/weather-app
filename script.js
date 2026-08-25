// 1. DOM Elements ko function k bahar define karein taake har click par DOM query na karni pary
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const searchBtn = document.getElementById("searchBtn");

// 2. Switch statement ki jagah ek "Lookup Object" use karein (O(1) Time Complexity)
const weatherIcons = {
    0: "☀️", 1: "🌤", 2: "⛅️", 3: "☁️",
    45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌦️", 80: "🌦️", 81: "🌦️", 82: "🌦️",
    61: "🌧️", 63: "🌧️", 65: "🌧️",
    71: "❄️", 73: "❄️", 75: "❄️",
    95: "⛈️", 96: "⛈️", 99: "⛈️"
};

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        // Alert ki jagah UI mai error dikhana behtar User Experience (UX) hy
        result.innerHTML = "<span style='color: #fca5a5;'>Please enter a city name</span>";
        return;
    }

    result.innerHTML = "";
    loading.style.display = "block";

    try {
        // 3. encodeURIComponent() use karein taake spaces ya special characters URL ko break na karein
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
        
        // 4. API errors (jaise 404 ya 500) check karne ki best practice
        if (!geoRes.ok) throw new Error("Network issue while fetching location");
        
        const geoData = await geoRes.json();

        // 5. Optional Chaining (?.) use kiya hy taake undefined errors na aayein
        if (!geoData.results?.length) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        if (!weatherRes.ok) throw new Error("Network issue while fetching weather");
        
        const weatherData = await weatherRes.json();
        const weather = weatherData.current_weather;

        // Lookup object se icon get karna (agar code nahi mila to default "🌤" use hoga)
        const icon = weatherIcons[weather.weathercode] || "🌤";

        // (Note: Open-Meteo default wind speed km/h mai deta hy, isliye m/s ki jagah km/h kar diya hy)
        result.innerHTML = `
            <h3>${name}</h3>
            <div class="icon-wrapper">${icon}</div>
            <p>🌡 Temperature: ${weather.temperature}°C</p>
            <p>💨 Wind Speed: ${weather.windspeed} km/h</p>
        `;

    } catch (error) {
        console.error("Weather App Error:", error);
        // Custom error messages
        result.innerHTML = `❌ ${error.message === "City not found" ? "City not found. Try again." : "Error fetching data."}`;
    } finally {
        // 6. 'finally' block hamesha run hota hy, chahy try block successful ho ya error aaye. 
        // Is se loading state safely hide ho jati hy.
        loading.style.display = "none";
    }
}

// 7. Event Listeners (Inline HTML onclick ki jagah yeh modern approach hy)
if (searchBtn) {
    searchBtn.addEventListener("click", getWeather);
}

// 8. User ki asani k liye "Enter" key press karne par search trigger karna
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeather();
    }
});
