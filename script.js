const apiKey = "143a2fc2324eda5597969126343ac407"
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=${apiKey}`

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