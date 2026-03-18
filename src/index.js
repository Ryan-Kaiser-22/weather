// src/index.js
import { searchBtn, searchInput, clearInput } from './modules/dom.js';
import { getCoordinates, getWeatherData, saveLastCity, getLastCity } from './modules/logic.js';
import { unitToggleBtn } from './modules/dom.js';
import { renderCityDropdown, selectCity, toggleLoading, toggleUnits, renderWeather } from './modules/ui.js';
import './assets/styles/main.css';

let lastFetchedData = null;

window.addEventListener('DOMContentLoaded', async () => {
  const lastCity = getLastCity();
  const initialCity = lastCity || "Los Angeles";
  performSearch(initialCity, false);
});

searchInput.addEventListener('input', (e) => {
    const cursorPosition = e.target.selectionStart;
    let value = e.target.value;
    const formattedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    e.target.value = formattedValue;
    e.target.setSelectionRange(cursorPosition, cursorPosition);
});

/**
 * @param {string} city 
 * @param {boolean} shouldSave 
 */
async function performSearch(city, shouldSave = true) {
  const cleanCity = sanitizeCityInput(city);
  if (!cleanCity) return;

  try {
    toggleLoading(true);
    const locationData = await getCoordinates(cleanCity);
    if (locationData) {
      const weatherData = await getWeatherData(locationData.latitude, locationData.longitude);
      lastFetchedData = weatherData;
      renderWeather(weatherData, locationData.fullName);
      if (shouldSave) {
        saveLastCity(cleanCity);
      }
    }
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    toggleLoading(false);
  }
}

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const city = searchInput.value;
  const cleanCity = sanitizeCityInput(city);
  
  if (!cleanCity) return;

  try {
    toggleLoading(true);
    const cities = await getCoordinates(cleanCity); 
    
    if (cities && cities.length > 0) {
      if (cities.length === 1) {
        handleCitySelection(cities[0]);
      } else {
        renderCityDropdown(cities);
        toggleLoading(false); 
      }
    }
  } catch (error) {
    console.error("Search error:", error);
    toggleLoading(false);
  }
});

export async function handleCitySelection(city) {
  try {
    toggleLoading(true);
    const weatherData = await getWeatherData(city.latitude, city.longitude);
    lastFetchedData = weatherData;
    const fullName = `${city.name}, ${city.admin1 || city.country}`;
    renderWeather(weatherData, fullName);
    saveLastCity(city.name);
    clearInput();
  } catch (error) {
    console.error("Weather fetch error:", error);
  } finally {
    toggleLoading(false);
  }
}

unitToggleBtn.addEventListener('click', () => {
  if (lastFetchedData) {
    toggleUnits(lastFetchedData);
  }
});

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

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('city-dropdown');
  const searchForm = document.getElementById('search-form');
  
  if (!searchForm.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});