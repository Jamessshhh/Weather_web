const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const cityNameElement = document.querySelector(".city-name");
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const weatherIconElement = document.querySelector(".weather-icon");
const windElement = document.querySelector(".wind");
const humidityElement = document.querySelector(".humidity");
const forecastContainer = document.querySelector(".forecast-cards");

const API_KEY = "ad574d500e8afe03c826bee2296669ad"; // Replace with your OpenWeather API key

const fetchWeather = (city) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
            temperatureElement.textContent = `${data.main.temp.toFixed(1)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            windElement.textContent = `🌬 Wind: ${data.wind.speed} m/s`;
            humidityElement.textContent = `💧 Humidity: ${data.main.humidity}%`;

            fetchForecast(city);
        })
        .catch(() => alert("City not found!"));
};

const fetchForecast = (city) => {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = "";

            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
                const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                const temp = `${day.main.temp.toFixed(1)}°C`;

                const forecastCard = document.createElement("div");
                forecastCard.classList.add("forecast-card");
                forecastCard.innerHTML = `
                    <p>${date}</p>
                    <img src="${icon}" alt="${day.weather[0].description}">
                    <p>${temp}</p>
                `;

                forecastContainer.appendChild(forecastCard);
            }
        })
        .catch(() => alert("Could not fetch forecast!"));
};

searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            
            fetch(URL)
                .then(response => response.json())
                .then(data => {
                    fetchWeather(data.name);
                })
                .catch(() => alert("Could not get location weather!"));
        });
    } else {
        alert("Geolocation not supported.");
    }
});
