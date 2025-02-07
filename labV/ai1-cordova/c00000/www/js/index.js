document.getElementById('getWeather').addEventListener('click', function() {
    let city = document.getElementById('city').value.trim();
    let apiKey = '7471a347d5c6096f9cd22f895152321d'; // klucz

    if (city === "") {
        alert("Proszę wpisać nazwę miasta!");
        return;
    }

    // XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            document.getElementById('weatherResult').innerHTML = `
                <h2>Aktualna pogoda w ${data.name}</h2>
                <p>Temperatura: <strong>${data.main.temp}°C</strong></p>
                <p>Wilgotność: <strong>${data.main.humidity}%</strong></p>
                <p>Ciśnienie: <strong>${data.main.pressure} hPa</strong></p>
                <p>Wiatr: <strong>${data.wind.speed} m/s</strong></p>
                <p>Warunki: <strong>${data.weather[0].description}</strong></p>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Ikona pogody">
            `;
        } else {
            document.getElementById('weatherResult').innerHTML = `<p>Błąd: Nie udało się pobrać danych o pogodzie.</p>`;
        }
    };

    xhr.onerror = function() {
        document.getElementById('weatherResult').innerHTML = `<p>Błąd połączenia z serwerem!</p>`;
    };

    xhr.send();

    // Fetch API
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Błąd podczas pobierania prognozy.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let forecastHTML = `<h2>Prognoza 5-dniowa dla ${data.city.name}</h2>`;
            data.list.forEach((entry, index) => {
                if (index % 8 === 0) { // Co 8 wpisów = 1 dzień
                    forecastHTML += `
                        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px; display: inline-block;">
                            <p><strong>${entry.dt_txt}</strong></p>
                            <p>Temperatura: <strong>${entry.main.temp}°C</strong></p>
                            <p>Warunki: <strong>${entry.weather[0].description}</strong></p>
                            <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="Ikona pogody">
                        </div>
                    `;
                }
            });
            document.getElementById('forecastResult').innerHTML = forecastHTML;
        })
        .catch(error => {
            document.getElementById('forecastResult').innerHTML = `<p>${error.message}</p>`;
        });
});
