// src/index.js
import { searchBtn, searchInput, clearInput } from './modules/dom.js';
import { getCoordinates, getWeatherData, saveLastCity, getLastCity } from './modules/logic.js';
import { unitToggleBtn } from './modules/dom.js';
import { toggleUnits, renderWeather } from './modules/ui.js';
import './assets/styles/main.css';

let lastFetchedData = null;

// Initial load state
window.addEventListener('DOMContentLoaded', async () => {
  const lastCity = getLastCity();
  if (lastCity) {
    // No need to sanitize here as it was sanitized before saving
    performSearch(lastCity, false); 
  }
});

searchInput.addEventListener('input', (e) => {
    const cursorPosition = e.target.selectionStart;
    let value = e.target.value;

    // Capitalize the first letter of each word
    const formattedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    e.target.value = formattedValue;

    // Restore cursor position so it doesn't jump to the end
    e.target.setSelectionRange(cursorPosition, cursorPosition);
});

/**
 * @param {string} city 
 * @param {boolean} shouldSave - Whether to write to localStorage
 */
async function performSearch(city, shouldSave = true) {
  // 1. Sanitize the input
  const cleanCity = sanitizeCityInput(city);
  if (!cleanCity) return;

  try {
    const locationData = await getCoordinates(cleanCity);
    if (locationData) {
      const weatherData = await getWeatherData(locationData.latitude, locationData.longitude);
      lastFetchedData = weatherData;
      
      // Render using the formal name from geocoding API
      renderWeather(weatherData, locationData.fullName);

      // 2. Save the clean version
      if (shouldSave) {
        saveLastCity(cleanCity);
      }
    }
  } catch (error) {
    console.error("Search error:", error);
  }
}

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const city = searchInput.value;
  
  // Pass to performSearch which handles the cleaning
  await performSearch(city);
  clearInput();
});

unitToggleBtn.addEventListener('click', () => {
  if (lastFetchedData) {
    toggleUnits(lastFetchedData);
  }
});

// Helper for cleaning
function sanitizeCityInput(input) {
  return input
    .trim()
    .replace(/[^a-zA-Z\s-]/g, '')
    .toLowerCase()
    .split(' ')
    .filter(word => word !== '')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}