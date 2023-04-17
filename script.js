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