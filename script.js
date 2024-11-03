// Add event listener for the Get Weather button
const btn = document.getElementById('btn');
btn.addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = '171e009cae7e126fcbcec49c3a5cee6a'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error:', error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => {
            console.error('Error:', error);
        });
});

// Function to display the weather for the searched city
function displayWeather(data) {
    const result = document.getElementById('result');
    if (data.cod === '404') {
        result.innerHTML = 'City not found. Please try again.';
    } else {
        result.innerHTML = `
            <div style="font-family: 'Alkatra', serif; text-align: left; padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #000 ; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h1><p><u> Weather of ${data.name}</u></p></h1>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}\u00B0 C</p>
                <p><strong>Feels like:</strong> ${Math.round(data.main.feels_like - 273.15)}\u00B0 C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
                <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                <p><strong>Wind speed:</strong> ${data.wind.speed} m/s</p>
                <p><strong>Wind direction:</strong> ${data.wind.deg} degrees</p>
                <button onclick="addFavorite('${data.name}')">Add to Favorites</button>
            </div>`;
    }
}

// Function to display the weather forecast
function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = `<h2>5-Day Forecast</h2>`;

    const dailyData = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    Object.keys(dailyData).forEach(date => {
        const avgTemp = dailyData[date].reduce((acc, item) => acc + item.main.temp, 0) / dailyData[date].length;
        const feelsLike = dailyData[date].reduce((acc, item) => acc + item.main.feels_like, 0) / dailyData[date].length;
        const humidity = dailyData[date].reduce((acc, item) => acc + item.main.humidity, 0) / dailyData[date].length;
        const pressure = dailyData[date].reduce((acc, item) => acc + item.main.pressure, 0) / dailyData[date].length;
        const windSpeed = dailyData[date].reduce((acc, item) => acc + item.wind.speed, 0) / dailyData[date].length;
        const windDirection = dailyData[date].reduce((acc, item) => acc + item.wind.deg, 0) / dailyData[date].length;
        const description = dailyData[date][0].weather[0].description;
        const icon = getLocalIcon(dailyData[date][0].weather[0].icon);
    
        forecast.innerHTML += `
        <div class="forecast-day" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #000; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin: 10px; width: 180px;">
            <h4><p>${new Date(date).toLocaleDateString()}</p></h4>
            <img src="${icon}" alt="${description}" style="width: 80px; height: 80px; margin-bottom: 10px;">
            <p align="left"><strong>Temp:</strong> ${Math.round((avgTemp - 273.15) * 100) / 100}\u00B0 C</p>
            <p align="left"><strong>Feels Like:</strong> ${Math.round((feelsLike - 273.15) * 100) / 100}\u00B0 C</p>
            <p align="left"><strong>Humidity:</strong> ${humidity} %</p>
            <p align="left"><strong>Pressure:</strong> ${pressure} hPa</p>
            <p align="left"><strong>Wind Speed:</strong> ${Math.round(windSpeed * 100) / 100} m/s</p>
            <p align="left"><strong>Wind Direction:</strong> ${Math.round(windDirection * 100) / 100} degrees</p>
            <p align="left">${description}</p>
        </div>`;
    });
}

// Function to get the local icon for weather
function getLocalIcon(weatherIcon) {
    const iconMapping = {
        '01d': 'clear-sky.png',
        '01n': 'night-clear.png',
        '02d': 'partly-cloudy-day.png',
        '02n': 'partly-cloudy-night.png',
        '03d': 'cloudy.png',
        '03n': 'cloudy.png',
        '04d': 'day-overcast.png',
        '04n': 'day-overcast.png',
        '09d': 'rain.png',
        '09n': 'rainy.png',
        '10d': 'rain.png',
        '10n': 'rainy.png',
        '11d': 'thunderstorm.png',
        '11n': 'thunderstorm.png',
        '13d': 'snow.png',
        '13n': 'snow.png',
        '50d': 'mist.png',
        '50n': 'mist.png',
    };
    return iconMapping[weatherIcon] || 'clear-sky.png';
}

// Function to add a location to favorites
function addFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

// Function to display favorite locations
function displayFavorites() {
    const favoriteContainer = document.getElementById('favorites');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoriteContainer.innerHTML = `<h2>Favorite Locations</h2>`;
    favorites.forEach(city => {
        favoriteContainer.innerHTML += `<p>${city}</p>`;
    });
}

// Initial call to display favorites on page load
displayFavorites();
