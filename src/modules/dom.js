// src/modules/dom.js
export const forecastContainer = document.querySelector('.forecast-container');
export const unitToggleBtn = document.querySelector('#unit-toggle');
export const searchForm = document.querySelector('#search-form');
export const searchInput = document.querySelector('#city-search');
export const searchBtn = document.querySelector('#submit-btn');
export const weatherCard = document.querySelector('.weather-card');
export const cityNameDisplay = document.querySelector('.city-name');
export const tempDisplay = document.querySelector('.temperature');
export const descriptionDisplay = document.querySelector('.description');

export function clearInput() {
  searchInput.value = '';
}