window.onload = function () {
    const today = new Date();

    const date = today.toLocaleDateString();
    const time = today.toLocaleTimeString();

    document.getElementById('date-time').innerHTML = `Date: ${date} Time: ${time}`;
}