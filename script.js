const apiKey = '143a2fc2324eda5597969126343ac407';
let city = 'Kyiv';
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

const currentCityName = document.querySelector('.current-city-name');
const currentTemperature = document.querySelector('.current-temperature');
const description = document.querySelector('.description');
const searchBar = document.querySelector('.search-bar');

async function getWeatherData(){
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

getWeatherData().then(data => {
    console.log(data)
    currentCityName.textContent = data.city.name;
    currentTemperature.textContent = Math.round(data.list[0].main.temp) + '°C';
    description.textContent = data.list[0].weather[0].description;
}).catch(error => console.log(error));

function updateDateTime() {
    const today = new Date();
    const date = today.toLocaleDateString();
    const time = today.toLocaleTimeString();
    document.getElementById('date-time').innerHTML = `Date: ${date} <br> Time: ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);