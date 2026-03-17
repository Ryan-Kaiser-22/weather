// src/modules/ui.js
import { cityNameDisplay, tempDisplay, descriptionDisplay, weatherCard, unitToggleBtn, forecastContainer } from './dom.js';
import clearIcon from '../assets/images/clear.png';
import cloudyIcon from '../assets/images/cloudy.png';
import fogIcon from '../assets/images/fog.png';
import drizzleIcon from '../assets/images/drizzle.png';
import rainIcon from '../assets/images/rain.png';
import snowIcon from '../assets/images/snow.png';
import thunderIcon from '../assets/images/thunderstorm.png';

const loader = document.querySelector('#loading-spinner');

export function toggleLoading(isVisible) {
  if (isVisible) {
    loader.classList.remove('hidden');
    weatherCard.classList.add('hidden'); 
  } else {
    loader.classList.add('hidden');
  }
}

let currentUnit = 'F';
let currentTempC = 0; 

export function renderWeather(data, locationName) {
  // Store the temp in Celsius (Open-Meteo's default unless you changed logic.js)
  currentTempC = data.current_weather.temperature;
  
  cityNameDisplay.textContent = locationName;
  descriptionDisplay.textContent = getWeatherDescription(data.current_weather.weathercode);
  
  // Use our helper to set the temperature and button text correctly
  updateTemperatureDisplay();

  renderForecast(data.daily);
  weatherCard.classList.remove('hidden');
}

function renderForecast(dailyData) {
  forecastContainer.innerHTML = ''; 

  dailyData.time.forEach((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const code = dailyData.weathercode[index];

    const maxTempC = dailyData.temperature_2m_max[index];
    const minTempC = dailyData.temperature_2m_min[index];
    
    const displayHigh = currentUnit === 'C' ? maxTempC : (maxTempC * 9/5) + 32;
    const displayLow = currentUnit === 'C' ? minTempC : (minTempC * 9/5) + 32;

    const tempForMeter = currentUnit === 'F' ? displayHigh : (displayHigh * 9/5) + 32;

    let barWidth = ((tempForMeter + 25) / 150) * 100;
    barWidth = Math.max(1, Math.min(barWidth, 100)); 

    // Get the category name and build the image path
    const category = getWeatherCategory(code);
    const iconPath = getWeatherIcon(code);

    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');

    dayElement.innerHTML = `
        <img src="${iconPath}" alt="${category}" class="weather-icon">
        <div class="forecast-day-content">
            <span class="day-name">${dayName}</span>
            <span class="day-desc">${getWeatherDescription(code)}</span>
            <div class="day-temp">
                <span class="high">${Math.round(displayHigh)}°</span>
                <span class="slash">/</span>
                <span class="low">${Math.round(displayLow)}°</span>
            </div>
        </div>
        <div class="temp-meter-container">
            <div class="temp-meter-bar" style="width: ${barWidth}%;"></div>
        </div>
    `;
    forecastContainer.appendChild(dayElement);
  });
}

function getWeatherIcon(code) {
  if (code === 0) return clearIcon;
  if (code >= 1 && code <= 3) return cloudyIcon;
  if (code === 45 || code === 48) return fogIcon;
  if (code >= 51 && code <= 55) return drizzleIcon;
  if (code >= 61 && code <= 65 || code >= 80 && code <= 82) return rainIcon;
  if (code >= 71 && code <= 77) return snowIcon;
  if (code >= 95) return thunderIcon;
  return cloudyIcon; // Fallback
}

export function toggleUnits(data) { // Pass the weather data in here
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  updateTemperatureDisplay();
  
  // If we have forecast data stored or passed, re-render it
  if (data && data.daily) {
    renderForecast(data.daily);
  }
}

function updateTemperatureDisplay() {
  const isCelsius = currentUnit === 'C';

  const displayValue = isCelsius 
    ? currentTempC 
    : (currentTempC * 9/5) + 32;

  tempDisplay.textContent = `${Math.round(displayValue)}°${currentUnit}`;
  
  // Fixed: Now isCelsius is defined and can be used here
  unitToggleBtn.textContent = `Switch to °${isCelsius ? 'F' : 'C'}`;
}

function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
  };
  return codes[code] || 'Cloudy';
}

function getWeatherCategory(code) {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 61 && code <= 65 || code >= 80 && code <= 82) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'cloudy'; // Fallback
}
