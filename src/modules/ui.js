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
  currentTempC = data.current_weather.temperature;
  const code = data.current_weather.weathercode; 
  
  cityNameDisplay.textContent = locationName;
  descriptionDisplay.textContent = getWeatherDescription(code);
  
  const mainIcon = document.querySelector('#current-weather-icon');
  if (mainIcon) {
    mainIcon.src = getWeatherIcon(code);
    mainIcon.alt = getWeatherDescription(code);
  }

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
  const category = getWeatherCategory(code);
  
  const iconMap = {
    'clear': clearIcon,
    'cloudy': cloudyIcon,
    'fog': fogIcon,
    'drizzle': drizzleIcon,
    'rain': rainIcon,
    'snow': snowIcon,
    'thunderstorm': thunderIcon
  };

  return iconMap[category] || cloudyIcon;
}

export function toggleUnits(data) { 
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  updateTemperatureDisplay();
  
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
  return 'cloudy'; 
}
