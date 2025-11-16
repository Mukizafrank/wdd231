const API_KEY = 'd8359858ba7f3dd56605b871be0e8fca'; // You'll need to get this from OpenWeatherMap
const LAT = '-1.9441';  // Kigali latitude
const LON = '30.0619';  // Kigali longitude

export async function fetchWeatherData() {
    try {
        // Using coordinates for more accuracy
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Weather data not available. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data); // Debug log
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayWeatherError();
    }
}

function displayWeatherData(data) {
    // Current weather
    const current = data.list[0];
    document.getElementById('current-temp').textContent = `${Math.round(current.main.temp)}°F`;
    document.getElementById('weather-desc').textContent = current.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${current.main.humidity}%`;
    
    // 3-day forecast
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    // Get unique days (OpenWeatherMap provides data every 3 hours)
    const dailyForecasts = [];
    const processedDays = new Set();
    
    for (const forecast of data.list) {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString();
        
        if (!processedDays.has(dateString) && dailyForecasts.length < 3) {
            dailyForecasts.push(forecast);
            processedDays.add(dateString);
        }
    }
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°F</div>
            <div class="weather-desc-small">${forecast.weather[0].description}</div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

function displayWeatherError() {
    document.getElementById('current-temp').textContent = '--°F';
    document.getElementById('weather-desc').textContent = 'Data unavailable';
    document.getElementById('humidity').textContent = 'Humidity: --%';
    
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '<p>Weather forecast currently unavailable</p>';
}