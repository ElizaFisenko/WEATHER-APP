let apiKey = "5f68aa65e1a9a27ce8d4d2eebf53b5a9";
let units = "metric";

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let monthes = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  let month = monthes[date.getMonth()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  
  return `${month} ${date.getDate()}, ${day}, ${hours} : ${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class = "row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML = forecastHTML + `
        <div class="col-2">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="42" />
          <div class="weather-forecast-temp">
            <span class="weather-forecast-temp-max">${Math.round(forecastDay.temp.max)}°C</span>
            <span class="weather-forecast-temp-min">${Math.round(forecastDay.temp.min)}°C</span>
          </div>
        </div>
      `;
    }
  })

  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML;
}

function celsiusTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#cityTemp"); 
  celsiusMetric.classList.add("active");
  fahrenheitMetric.classList.remove("active");
  currentTemperature.innerHTML = currentTemp;
}

function fahrenheitTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#cityTemp");
  celsiusMetric.classList.remove("active");
  fahrenheitMetric.classList.add("active");
  let fahrenheitTemperature = Math.round((currentTemp * 9) / 5 + 32);
  currentTemperature.innerHTML = `${fahrenheitTemperature}`;
}

function load() {
  let city = "Kyiv";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function cityTemp(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".form-control");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function tempByGeo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemp);
  });
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
  let cityName = response.data.name;
  let weatherDescript = response.data.weather[0].description;
  currentTemp = Math.round(response.data.main.temp);
  let speedWind = response.data.wind.speed;
  let currentPress = response.data.main.pressure;
  let currentHum = response.data.main.humidity;
  let currentSunriseHours = new Date(response.data.sys.sunrise*1000).getHours();
  let currentSunriseMin = new Date(response.data.sys.sunrise*1000).getMinutes();
  let currentSunsetHours = new Date(response.data.sys.sunset*1000).getHours();
  let currentSunsetMin = new Date(response.data.sys.sunset*1000).getMinutes();
  let currentIcon = response.data.weather[0].icon;

  let city = document.querySelector("#city");
  let fullDate = document.querySelector("#date");
  let weatherDescription = document.querySelector("li#description");
  let currentTemperature = document.querySelector("#cityTemp"); 
  let wind = document.querySelector("li#wind"); 
  let currentPressure = document.querySelector("li#pressure"); 
  let currentHumidity = document.querySelector("li#humidity"); 
  let currentSunrise = document.querySelector("li#sunrise"); 
  let currentSunset = document.querySelector("li#sunset"); 
  let iconElement = document.querySelector("#icon");

  city.innerHTML = cityName;
  weatherDescription.innerHTML = weatherDescript;
  currentTemperature.innerHTML = currentTemp;
  wind.innerHTML = `Wind: ${speedWind} m/s`;
  currentPressure.innerHTML = `Pressure: ${currentPress} hPA`;
  currentHumidity.innerHTML = `Humidity: ${currentHum}%`;
  currentSunrise.innerHTML = `Sunrise: ${currentSunriseHours}:${currentSunriseMin} am`;
  currentSunset.innerHTML = `Sunset: ${currentSunsetHours}:${currentSunsetMin} pm`;
  fullDate.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}@2x.png`);
  iconElement.setAttribute("alt", weatherDescript);

  getForecast(response.data.coord);
}

window.onload = load;

let currentTemp = null;

let celsiusMetric = document.querySelector("#celsius");
celsiusMetric.addEventListener("click", celsiusTemp);

let fahrenheitMetric = document.querySelector("#fahrenheit");
fahrenheitMetric.addEventListener("click", fahrenheitTemp);

let searchButton = document.querySelector("#city-form");
searchButton.addEventListener("submit", cityTemp);

let geoButton = document.querySelector("button");
geoButton.addEventListener("click", tempByGeo);

