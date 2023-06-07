const apiKey = "143a2fc2324eda5597969126343ac407";
let city = "Kyiv";

// basic search
const currentCityName = document.querySelector(".current-city-name");
const currentTemperature = document.querySelector(".current-temperature");
const description = document.querySelector(".description");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.getElementById("search-btn");
const coord = document.getElementById("coordinates");

// current info block
const wind = document.querySelector(".weather-value-wind");
const humidity = document.querySelector(".weather-value-humidity");
const pressure = document.querySelector(".weather-value-pressure");
const sunrise = document.querySelector(".weather-value-sunrise");
const sunset = document.querySelector(".weather-value-sunset");
const airQuality = document.querySelector(".weather-value-airQuality");

// five-day forecast block
const forecastDates = document.querySelectorAll(".weather-date");
const forecastTemp = document.querySelectorAll(".weather-temperature");
const forecastDescription = document.querySelectorAll(
    ".weather-additional-info"
);

// fifth day info
const lastForecastDesc = document.querySelector(
    ".last-weather-additional-info"
);
const lastForecastDate = document.querySelector(".last-weather-date");
const lastForecastTemp = document.querySelector(".last-weather-temperature");

// for change format button
const timeFormatBtn = document.getElementById("time-format-btn");
const timeFormatDisplay = document.getElementById("date-time");
const dateFormatBtn = document.getElementById("date-format-btn");
const toggleTempBtn = document.getElementById("temp-toggle-btn");

// format variables
let timeFormat = "en-GB";
let dateFormat = "en-GB";
let temperatureUnit = "metric";

// fav list
const favoritesList = document.getElementById("favorites-list");
const addToFavsBtn = document.getElementById("add-to-favs-btn");
const clearFavsBtn = document.getElementById("clear-favorites-btn");

let selectedCity = city;

function getCityName(input) {
    let city = input.value.trim();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    return city;
}
searchButton.addEventListener("click", () => {
    city = getCityName(searchBar);
    if (city !== ``) {
        updateCurrentWeather(city);
        updateForecast(city);
    }
    searchBar.value = "";
});

searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        city = getCityName(searchBar);
        if (city !== ``) {
            updateCurrentWeather(city);
            updateForecast(city);
        }
        searchBar.value = "";
    }
});

function toggleTimeFormat() {
    timeFormat = timeFormat === "en-GB" ? "en-US" : "en-GB";
    updateDateTime();
    updateCurrentWeather(selectedCity);
    updateForecast(selectedCity);
}

function toggleDateFormat() {
    dateFormat = dateFormat === "en-GB" ? "en-US" : "en-GB";
    updateDateTime();
    updateCurrentWeather(selectedCity);
    updateForecast(selectedCity);
}

function toggleTemperatureUnit() {
    temperatureUnit = temperatureUnit === "metric" ? "imperial" : "metric";
    updateCurrentWeather(selectedCity);
    updateForecast(selectedCity);
}

function updateDateTime() {
    const today = new Date();

    const time = new Date(Date.now()).toLocaleTimeString(timeFormat);
    timeFormatDisplay.textContent = `Time: ${time}`;

    const date = today.toLocaleDateString(dateFormat);
    timeFormatDisplay.innerHTML = `Date: ${date} <br> ${timeFormatDisplay.textContent}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

timeFormatBtn.addEventListener("click", toggleTimeFormat);
dateFormatBtn.addEventListener("click", toggleDateFormat);
toggleTempBtn.addEventListener("click", toggleTemperatureUnit);

// I don`t use this function in code, but overall its really useful thing for date/time formatting
function addZeros(value) {
    return value.toString().padStart(2, "0");
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${temperatureUnit}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
    }
    const data = await response.json();
    return data;
}

async function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${temperatureUnit}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}


function displayWeatherData(data, city) {
    selectedCity = city;
    const temperatureSymbol = temperatureUnit === "metric" ? "°C" : "°F";

    const lat = data.city.coord.lat;
    const lon = data.city.coord.lon;

    coord.innerHTML = `Latitude: ${lat}<br>Longitude: ${lon}`;
    currentCityName.textContent = `${data.city.name}, ${data.city.country}`;
    currentTemperature.textContent =
        Math.round(data.list[0].main.temp) + temperatureSymbol;
    description.textContent = data.list[0].weather[0].description;
    wind.textContent = data.list[0].wind.speed + " m/s";
    humidity.textContent = data.list[0].main.humidity + " %";
    pressure.textContent = data.list[0].main.pressure + " hPa";

    const timezoneOffset = new Date().getTimezoneOffset();

    const sunriseTime = new Date(
        (data.city.sunrise + timezoneOffset * 60 + data.city.timezone) * 1000
    );
    const sunsetTime = new Date(
        (data.city.sunset + timezoneOffset * 60 + data.city.timezone) * 1000
    );

    sunrise.textContent = sunriseTime.toLocaleTimeString(timeFormat);
    sunset.textContent = sunsetTime.toLocaleTimeString(timeFormat);

    updateAirQuality(lat, lon);
}
function handleFetchError(error) {
    console.log(error);
    alert(
        `${error.name}: ${city} is not valid city name. Please enter city name again! `
    );
    city = "";
}

function updateCurrentWeather(city) {
    fetchWeatherData(city)
        .then((data) => displayWeatherData(data, city))
        .catch(handleFetchError);
}

updateCurrentWeather(city);

function updateForecast(city) {
    selectedCity = city;
    const temperatureSymbol = temperatureUnit === "metric" ? "°C" : "°F";
    getWeatherData(city).then((data) => {
        const filteredData = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
        );
        console.log(filteredData);

        const now = new Date();
        let currentHour = now.getHours();
        let startIndex = 0;

        if (currentHour < 15) {
            startIndex = 1;
            lastForecastDate.textContent =
                new Date(
                    data.list[39].dt * 1000 + data.city.timezone * 1000
                ).toLocaleDateString(dateFormat) +
                ` (${data.list[39].dt_txt.split(" ")[1]})`;
            lastForecastTemp.textContent =
                Math.round(data.list[39].main.temp) + temperatureSymbol;
            document.getElementById(
                "icon4"
            ).src = `https://openweathermap.org/img/w/${data.list[39].weather[0].icon}.png`;
            lastForecastDesc.textContent = data.list[39].weather[0].description;
        } else {
            lastForecastDate.textContent = new Date(
                filteredData[4].dt * 1000 + data.city.timezone * 1000
            ).toLocaleDateString(dateFormat);
            lastForecastTemp.textContent =
                Math.round(filteredData[4].main.temp) + temperatureSymbol;
            lastForecastDesc.textContent = filteredData[4].weather[0].description;
        }

        filteredData.slice(startIndex).forEach((item, index) => {
            const forecastDate = new Date(
                item.dt * 1000 + data.city.timezone * 1000
            ).toLocaleDateString(dateFormat);
            const weatherCode = filteredData[index].weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/w/${weatherCode}.png`;
            const weatherIcon = document.getElementById("icon" + index);

            weatherIcon.src = weatherIconUrl;

            forecastDates[index].textContent = forecastDate;
            forecastTemp[index].textContent =
                Math.round(item.main.temp) + temperatureSymbol;
            forecastDescription[index].textContent =
                filteredData[index].weather[0].description;
        });
    });
}

updateForecast(city);

let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];

function saveFavorites() {
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
}

function displayFavorites() {
    favoritesList.innerHTML = "";
    favorites.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => {
            selectedCity = listItem.textContent;
            updateCurrentWeather(selectedCity);
            updateForecast(selectedCity);
        });
        favoritesList.appendChild(listItem);
    });
}

async function addToFavorites() {
    try {
        await fetchWeatherData(city);
        if (!favorites.includes(city)) {
            favorites.push(city);
            saveFavorites();
            displayFavorites();
        }
    } catch (error) {
        console.error("Cannot add non-existing city!");
    }
}

addToFavsBtn.addEventListener("click", addToFavorites);

clearFavsBtn.addEventListener("click", () => {
    favorites = [];
    saveFavorites();
    displayFavorites();
});

displayFavorites();

const feedbackForm = document.querySelector(".feedback-form");

function toggleFeedback() {
    feedbackForm.style.display =
        feedbackForm.style.display === "none" ? "block" : "none";
}

const userComment = document.getElementById("comment-input");
function saveFeedback(feedback) {
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    return feedbacks;
}

function logFeedbacks(feedbacks) {
    feedbacks.forEach((feedback, index) => {
        console.log(`Feedback ${index + 1}:`);
        console.log(`Name: ${feedback.name}`);
        console.log(`Comment: ${feedback.comment}`);
    });
}

function sendFeedback() {
    const userName = document.getElementById("name-input");

    const name = userName.value.trim();
    const comment = userComment.value.trim();

    if (name === "" || comment === "") {
        alert("If you want to send feedback please fill all fields!");
        return;
    }

    const feedback = {
        name: name,
        comment: comment,
    };

    let feedbacks = saveFeedback(feedback);

    logFeedbacks(feedbacks);

    userName.value = "";
    userComment.value = "";

    alert("Thank you for your feedback!");
    feedbackForm.style.display = "none";
}

userComment.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendFeedback();
    }
});

async function getAirQualityData(lat, lon) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

const airQualityLevels = {
    1: { description: "Good", color: "#00FF00" },
    2: { description: "Fair", color: "#CCCC00" },
    3: { description: "Moderate", color: "#CC6600" },
    4: { description: "Poor", color: "#990000" },
    5: { description: "Very Poor", color: "#660000" },
};

function updateAirQuality(lat, lon) {
    getAirQualityData(lat, lon)
        .then((data) => {
            let aqi = data.list[0].main.aqi;
            airQuality.textContent = airQualityLevels[aqi].description;
            airQuality.style.color = airQualityLevels[aqi].color;
        })
        .catch((error) => {
            console.log(error);
        });
}

const themeBtn = document.getElementById('theme-toggle');

let currentTheme = 'light';

function toggleTheme(){
    const styleLink = document.getElementById('theme-style');
    if (currentTheme === 'light') {
        styleLink.href = 'modern-style.css?version=' + new Date().getTime();
        currentTheme = 'dark';
    } else {
        styleLink.href = 'styles.css?version=' + new Date().getTime();
        currentTheme = 'light';
    }
}

themeBtn.addEventListener('click', toggleTheme);