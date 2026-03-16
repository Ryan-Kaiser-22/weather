// src/index.js
import { searchBtn, searchInput, clearInput } from './modules/dom.js';
import { getCoordinates, getWeatherData } from './modules/logic.js';
import { unitToggleBtn } from './modules/dom.js';
import { toggleUnits, renderWeather } from './modules/ui.js';
import './assets/styles/main.css';

unitToggleBtn.addEventListener('click', () => {
  toggleUnits();
});

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Stop form from refreshing the page
  
  const city = searchInput.value;
  if (!city) return;

  try {
    // 1. Get Lat/Lon from the city name
    const locationData = await getCoordinates(city);
    
    if (locationData) {
      // 2. Get actual weather using those coordinates
      const weatherData = await getWeatherData(locationData.latitude, locationData.longitude);
      
      // 3. Update the UI
      renderWeather(weatherData, locationData.fullName);
    } else {
      alert("City not found. Please try again.");
    }
  } catch (error) {
    console.error("Application error:", error);
  }
  
  clearInput();
});