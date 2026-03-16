// src/index.js
import { searchBtn, searchInput, clearInput } from './modules/dom.js';
import { getCoordinates, getWeatherData, saveLastCity, getLastCity } from './modules/logic.js'; // Added save/get
import { unitToggleBtn } from './modules/dom.js';
import { toggleUnits, renderWeather } from './modules/ui.js';
import './assets/styles/main.css';

//Initial load state
window.addEventListener('DOMContentLoaded', async () => {
  const lastCity = getLastCity();
  if (lastCity) {
    performSearch(lastCity);
  }
});

let lastFetchedData = null;

async function performSearch(city) {
  try {
    const locationData = await getCoordinates(city);
    if (locationData) {
      const weatherData = await getWeatherData(locationData.latitude, locationData.longitude);
      lastFetchedData = weatherData;
      renderWeather(weatherData, locationData.fullName);
    }
  } catch (error) {
    console.error("Search error:", error);
  }
}

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const city = searchInput.value;
  if (!city) return;
  
  await performSearch(city);
  clearInput();
});

unitToggleBtn.addEventListener('click', () => {
  toggleUnits(lastFetchedData);
});