const apiKey = '143a2fc2324eda5597969126343ac407';
let city = 'Kyiv';
// basic search
const currentCityName = document.querySelector('.current-city-name');
const currentTemperature = document.querySelector('.current-temperature');
const description = document.querySelector('.description');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.getElementById('search-btn');

// current info block
const wind = document.querySelector('.weather-value-wind');
const humidity = document.querySelector('.weather-value-humidity');
const pressure = document.querySelector('.weather-value-pressure');
const sunrise = document.querySelector('.weather-value-sunrise');
const sunset = document.querySelector('.weather-value-sunset');

// five-day forecast block
const forecastDates = document.querySelectorAll('.weather-date');
const forecastTemp = document.querySelectorAll('.weather-temperature');
const lastForecastDate = document.querySelector('.last-weather-date');
const lastForecastTemp = document.querySelector('.last-weather-temperature');

// for change format button
const timeFormatBtn = document.getElementById('time-format-btn');
const timeFormatDisplay = document.getElementById('date-time');
const dateFormatBtn = document.getElementById('date-format-btn');
const toggleTempBtn = document.getElementById('temp-toggle-btn');

// format variables
let timeFormat = '24h';
let dateFormat = 'en-GB';
let temperatureUnit = 'metric';
searchButton.addEventListener('click', () => {
    city = searchBar.value.trim();
    if(city !== ``){
        updateCurrentWeather(city);
        updateForecast(city);
    }
});

function toggleTimeFormat(){
    timeFormat = timeFormat === '24h' ? '12h' : '24h';
    updateDateTime();
}
function toggleDateFormat(){
    dateFormat = dateFormat === 'en-GB' ? 'en-US' : 'en-GB';
    updateDateTime();
    updateForecast(city);
}

function toggleTemperatureUnit() {
    temperatureUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
    updateCurrentWeather(city);
    updateForecast(city);
}

function updateDateTime() {
    const today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (timeFormat === '12h'){
        let midday = 'AM';
    if(hours >= 12){
        midday = 'PM';
        hours -= 12;
    }
    if (hours === 0){
        hours = 12;
    }
        timeFormatDisplay.textContent = `Time: ${hours}:${addZeros(minutes)}:${addZeros(seconds)} ${midday}`;
    } else {
        timeFormatDisplay.textContent = `Time: ${addZeros(hours)}:${addZeros(minutes)}:${addZeros(seconds)}`
    }

    const date = today.toLocaleDateString(dateFormat);
    timeFormatDisplay.innerHTML = `Date: ${date} <br> ${timeFormatDisplay.textContent}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

timeFormatBtn.addEventListener('click', toggleTimeFormat);
dateFormatBtn.addEventListener('click', toggleDateFormat);
toggleTempBtn.addEventListener('click', toggleTemperatureUnit);

function addZeros(value){
    return value.toString().padStart(2, '0');
}

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${temperatureUnit}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error(`HTTP error! ${response.status}`)
    }
    const data = await response.json();
    return data;
}

function updateCurrentWeather(city) {
    const temperatureSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
    getWeatherData(city).then(data => {
        console.log(data)
        currentCityName.textContent = data.city.name;
        currentTemperature.textContent = Math.round(data.list[0].main.temp) + temperatureSymbol;
        description.textContent = data.list[0].weather[0].description;
        wind.textContent = data.list[0].wind.speed + ' m/s';
        humidity.textContent = data.list[0].main.humidity + ' %';
        pressure.textContent = data.list[0].main.pressure + ' hPa';
        sunrise.textContent = new Date(data.city.sunrise * 1000 + data.city.timezone * 1000).toLocaleTimeString();
        sunset.textContent = new Date(data.city.sunset * 1000 + data.city.timezone * 1000).toLocaleTimeString();
    }).catch(error => {
        console.log(error);
        alert(`${error.name}: ${city} is not valid city name. Please enter city name again! `)
    });
}

updateCurrentWeather(city);

function updateForecast(city) {
    const temperatureSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
    getWeatherData(city).then(data => {
        const filteredData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        console.log(filteredData);

        const now = new Date();
        let currentHour = now.getHours();
        let startIndex = 0;

        if(currentHour < 15) {
            startIndex = 1
            lastForecastDate.textContent = new Date(data.list[39].dt * 1000 + data.city.timezone * 1000).toLocaleDateString(dateFormat)+ ` (${data.list[39].dt_txt.split(' ')[1]})`;
            lastForecastTemp.textContent = Math.round(data.list[39].main.temp) + temperatureSymbol;
            document.getElementById('icon5').src = `https://openweathermap.org/img/w/${data.list[39].weather[0].icon}.png`
        }
        else {
            lastForecastDate.textContent = new Date(filteredData[4].dt * 1000 + data.city.timezone * 1000).toLocaleDateString(dateFormat);
            lastForecastTemp.textContent = Math.round(filteredData[4].main.temp) + temperatureSymbol;
        }

        filteredData.slice(startIndex).forEach((item, index) =>{
            const forecastDate = new Date(item.dt * 1000 + data.city.timezone * 1000).toLocaleDateString(dateFormat);
            const weatherCode = filteredData[index].weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/w/${weatherCode}.png`;
            const weatherIcon = document.getElementById('icon' + (index + 1));

            weatherIcon.src = weatherIconUrl;

            forecastDates[index].textContent = forecastDate;
            forecastTemp[index].textContent = Math.round(item.main.temp) + temperatureSymbol;
        })
    })
}

updateForecast(city);