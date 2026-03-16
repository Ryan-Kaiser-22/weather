// src/modules/dom.js
export const forecastContainer = document.querySelector('.forecast-container');
export const unitToggleBtn = document.querySelector('#unit-toggle');
export const searchForm = document.querySelector('#search-form');
export const searchInput = document.querySelector('#city-search');
export const searchBtn = document.querySelector('#submit-btn');

// 2. Capture the display areas
export const weatherCard = document.querySelector('.weather-card');
export const cityNameDisplay = document.querySelector('.city-name');
export const tempDisplay = document.querySelector('.temperature');
export const descriptionDisplay = document.querySelector('.description');

// 3. Optional: Export a function to clear the input
export function clearInput() {
  searchInput.value = '';
}