let now = new Date();
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
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let date = document.querySelector("li#currentDate");
date.innerHTML = `${monthes[now.getMonth()]} ${now.getDate()}`;

let dayHour = document.querySelector("li#dayHour");
dayHour.innerHTML = `${days[now.getDay()]}, ${hours} : ${minutes}`;

function celsiusTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("li#cityTemp"); 
  currentTemperature.innerHTML = 28;
}

let celsiusMetric = document.querySelector(".celsius");
celsiusMetric.addEventListener("click", celsiusTemp);

function fahrenheitTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("li#cityTemp");
  let fahrenheitTemperature = Math.round((currentTemperature.innerHTML * 9) / 5 + 32);
  currentTemperature.innerHTML = `${fahrenheitTemperature}`;
}

let fahrenheitMetric = document.querySelector(".fahrenheit");
fahrenheitMetric.addEventListener("click", fahrenheitTemp);

let apiKey = "5f68aa65e1a9a27ce8d4d2eebf53b5a9";
let units = "metric";

function load() {
  let city = "Kyiv";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}

function cityTemp(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".enterCity");
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

function showTemp(response) {
  let city = document.querySelector("li#city");
  city.innerHTML = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let speedWind = response.data.wind.speed;
  let currentPress = response.data.main.pressure;
  let currentHum = response.data.main.humidity;
  let currentSunriseHours = new Date(response.data.sys.sunrise*1000).getHours();
  let currentSunriseMin = new Date(response.data.sys.sunrise*1000).getMinutes();
  let currentSunsetHours = new Date(response.data.sys.sunset*1000).getHours();
  let currentSunsetMin = new Date(response.data.sys.sunset*1000).getMinutes();
  let currentTemperature = document.querySelector("li#cityTemp"); 
  let wind = document.querySelector("li#wind"); 
  let currentPressure = document.querySelector("li#pressure"); 
  let currentHumidity = document.querySelector("li#humidity"); 
  let currentSunrise = document.querySelector("li#sunrise"); 
  let currentSunset = document.querySelector("li#sunset"); 
  currentTemperature.innerHTML = currentTemp;
  wind.innerHTML = `Wind: ${speedWind} m/s`;
  currentPressure.innerHTML = `Pressure: ${currentPress} hPA`;
  currentHumidity.innerHTML = `Humidity: ${currentHum}%`;
  currentSunrise.innerHTML = `Sunrise: ${currentSunriseHours}:${currentSunriseMin} am`;
  currentSunset.innerHTML = `Sunset: ${currentSunsetHours}:${currentSunsetMin} pm`;
}

window.onload = load;

let searchButton = document.querySelector("#city-form");
searchButton.addEventListener("submit", cityTemp);

let geoButton = document.querySelector("button");
geoButton.addEventListener("click", tempByGeo);

