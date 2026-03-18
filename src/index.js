import { searchBtn, searchInput, clearInput, unitToggleBtn } from './modules/dom.js';
import { getCoordinates, getWeatherData, saveLastCity, getLastCity, sanitizeCityInput } from './modules/logic.js';
import { renderCityDropdown, toggleLoading, toggleUnits, renderWeather } from './modules/ui.js';
import './assets/styles/main.css';

let lastFetchedData = null;

window.addEventListener('DOMContentLoaded', async () => {
  const lastCity = getLastCity();
  
  if (lastCity && typeof lastCity === 'object' && lastCity.latitude) {
    handleCitySelection(lastCity);
  } else {
    try {
      toggleLoading(true);
      const defaultCities = await getCoordinates("Los Angeles");
      if (defaultCities && defaultCities.length > 0) {
        handleCitySelection(defaultCities[0]);
      }
    } catch (err) {
      console.error("Default load failed", err);
    } finally {
      toggleLoading(false);
    }
  }
});

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
      }
    } else {
        alert("City not found, please type full city name");
    }
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    toggleLoading(false);
    clearInput();
  }
});

export async function handleCitySelection(city) {
  try {
    toggleLoading(true);
    const weatherData = await getWeatherData(city.latitude, city.longitude);
    
    lastFetchedData = weatherData; 

    const fullName = `${city.name}, ${city.admin1 || city.country}`;
    
    if (weatherData) {
      renderWeather(weatherData, fullName);
      saveLastCity(city); 
    }
  } catch (error) {
    console.error("Selection error:", error);
  } finally {
    toggleLoading(false);
  }
}

document.addEventListener('city-selected', (e) => {
  handleCitySelection(e.detail);
});

unitToggleBtn.addEventListener('click', () => {
  if (lastFetchedData) {
    toggleUnits(lastFetchedData);
  }
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