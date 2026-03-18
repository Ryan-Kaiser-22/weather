// logic.js
export function sanitizeCityInput(input) {

  const cleanInput = input.trim().replace(/[^a-zA-Z\s-]/g, '');

  return cleanInput
    .split(/\s+/) 
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function getCoordinates(cityName) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=5&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found, please type full city name");
    }

    return data.results.map(city => ({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      admin1: city.admin1, 
      country: city.country,
      id: city.id 
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function getWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    if (!response.ok) throw new Error("Weather fetch failed");
    return await response.json();
  } catch (error) {
    console.error("Weather data error:", error);
    return null;
  }
}

export function saveLastCity(cityObject) {
  localStorage.setItem('lastWeatherCity', JSON.stringify(cityObject));
}

export function getLastCity() {
  const saved = localStorage.getItem('lastWeatherCity');
  return saved ? JSON.parse(saved) : null;
}