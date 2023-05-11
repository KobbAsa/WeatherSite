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
function updateDateTime() {
    const today = new Date();
    const date = today.toLocaleDateString();
    const time = today.toLocaleTimeString();
    document.getElementById('date-time').innerHTML = `Date: ${date} <br> Time: ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error(`HTTP error! ${response.status}`)
    }
    const data = await response.json();
    return data;
}

function updateCurrentWeather(city) {
    getWeatherData(city).then(data => {
        console.log(data)
        currentCityName.textContent = data.city.name;
        currentTemperature.textContent = Math.round(data.list[0].main.temp) + '°C';
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

searchButton.addEventListener('click', () => {
    const updatedCity = searchBar.value.trim();
    if(updatedCity !== ``){
        updateCurrentWeather(updatedCity);
        updateForecast(updatedCity);
    }
});

function updateForecast(city) {
    getWeatherData(city).then(data => {
        const filteredData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        console.log(filteredData);

        const now = new Date();
        const currentHour = now.getHours();
        let startIndex = 0;

        if(currentHour < 12) {
            startIndex = 1
        }

        filteredData.slice(startIndex).forEach((item, index) =>{
            const forecastDate = new Date(item.dt * 1000 + data.city.timezone * 1000).toLocaleDateString();
            forecastDates[index].textContent = forecastDate;
            forecastTemp[index].textContent = Math.round(item.main.temp) + '°C';
        })
    })
}

updateForecast(city);