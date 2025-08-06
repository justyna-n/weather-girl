const apiKey = "ef64a5098eabf407e723ebccd99d75e5"

async function getData(city, resultId = "weatherResult") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const resultBox = document.getElementById(resultId);
    const now = new Date();
    const date = now.toLocaleDateString();
    const temperature = Math.round(json.main.temp);
    const temperatureMin = Math.round(json.main.temp_min);
    const temperatureMax = Math.round(json.main.temp_max);
    const temperatureFeel = Math.round(json.main.feels_like);
    const description = json.weather[0].description;
    const iconCode = json.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    resultBox.innerHTML = `
      <p class="fs-4"><i class="bi bi-geo-alt-fill"></i> ${city}</p> <br>
      <p><i class="bi bi-calendar"></i> ${date}</p>
      <p><i class="bi bi-thermometer-half"></i> ${temperature}°C</p>
      <p>${description}</p>
      <img src="${iconUrl}" alt="Ikona pogody"> <br>
      <p>${temperatureMin}°C/${temperatureMax}°C</p>
      <p>Temp. odczuwalna ${temperatureFeel}°C</p><br>
    `;

  } catch (error) {
    console.error(error.message);
  }
}

async function getDataForAllSavedCities() {
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = ""; // Clear previous results

  for (const city of savedCities) {
    const cityWeatherDiv = document.createElement("div");
    cityWeatherDiv.className = "weather-card";
    cityWeatherDiv.id = `weather-${city}`;
    weatherContainer.appendChild(cityWeatherDiv);
    await getData(city, cityWeatherDiv.id);
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault(); // zatrzymuje odświeżenie strony
  const city = document.getElementById("cityInput").value;
  console.log(city);
  getData(city);
  //localStorage.removeItem("savedCities");
});

document.querySelector('#saveBtn').addEventListener("click", function () {
  const city = document.getElementById("cityInput").value;

  if (!savedCities.includes(city)) {
    if (savedCities.length >= 3) {
      savedCities.pop();
    }

    savedCities.unshift(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    console.log("Zapisuję dane do Local Storage");

    showSavedCities();
  }
});


let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

function showSavedCities() {
  const container = document.getElementById("savedCities");
  container.innerHTML = "";

  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

  savedCities.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.classList.add("saved-city-btn");
    btn.addEventListener("click", () => getData(city));
    container.appendChild(btn);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  showSavedCities();
  getDataForAllSavedCities();
});