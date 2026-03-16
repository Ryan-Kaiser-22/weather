// logic.js

export async function getCoordinates(cityName) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }

    // Extract lat, lon, and the formal name for the UI
    const { latitude, longitude, name, admin1, country } = data.results[0];
    return { latitude, longitude, fullName: `${name}, ${admin1 || country}` };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function getWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );
  return await response.json();
}