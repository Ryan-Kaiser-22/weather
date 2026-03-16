// src/modules/ui.js
import { cityNameDisplay, tempDisplay, descriptionDisplay, weatherCard, unitToggleBtn } from './dom.js';

let currentUnit = 'C';
let currentTempC = 0; // Store the original Celsius value

export function renderWeather(data, locationName) {
  currentTempC = data.current_weather.temperature;
  updateTemperatureDisplay();
  const temp = data.current_weather.temperature;
  
  cityNameDisplay.textContent = locationName;
  tempDisplay.textContent = `${Math.round(temp)}°C`;
  descriptionDisplay.textContent = getWeatherDescription(data.current_weather.weathercode);
  
  // Show the card once data is loaded
  weatherCard.classList.remove('hidden');
}

export function toggleUnits() {
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  updateTemperatureDisplay();
}

function updateTemperatureDisplay() {
  const displayValue = currentUnit === 'C' 
    ? currentTempC 
    : (currentTempC * 9/5) + 32;

  tempDisplay.textContent = `${Math.round(displayValue)}°${currentUnit}`;
  unitToggleBtn.textContent = `Switch to °${currentUnit === 'C' ? 'F' : 'C'}`;
}

// Helper to convert Open-Meteo codes to words
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    // add more based on Open-Meteo documentation
  };
  return codes[code] || 'Cloudy';
}