const apiKey = '143a2fc2324eda5597969126343ac407';
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=${apiKey}`;

const currentCityName = document.querySelector('.current-city-name');
const currentTemperature = document.querySelector('.current-temperature');
const description = document.querySelector('.description');

async function getWeatherData(){
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

getWeatherData().then((data) => console.log(data));


window.onload = function () {
    function updateDateTime() {
        const today = new Date();
        const date = today.toLocaleDateString();
        const time = today.toLocaleTimeString();
        document.getElementById('date-time').innerHTML = `Date: ${date} <br> Time: ${time}`;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}