const apiKey = "979f69fe29c91663dbe2dff7f27a1fca";
const assessKey = "WqBJrxXa3uxSi1JKrBB2d4JDTDtqkqe0wu7uA6zRWpo";
const openCageAPI = "df13556b935d4606a1f3a28f779d9f52";

const search = document.querySelector(".search");
search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const city = search.value;
    getWeather(city);
    FiveDayWeather(city);
    search.value = "";
  }
});
const dayTemArr = [];
const feelslikeArr = [];
const highestTemArr = [];
const lowestTemArr = [];
const dayIconArr = [];

for (let i = 1; i <= 5; i++) {
  dayTemArr.push(document.querySelector(`.dayTem${i}`));
  feelslikeArr.push(document.querySelector(`.feelslike${i}`));
  highestTemArr.push(document.querySelector(`.highestTem${i}`));
  lowestTemArr.push(document.querySelector(`.lowestTem${i}`));
  dayIconArr.push(document.querySelector(`.dayIcon${i}`));
}

function FiveDayWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayFiveDayWeather(data);
    })
    .catch((e) => {
      console.log("Cannot get the future five days data");
    });
}

function displayFiveDayWeather(data) {
  const fiveDayFilter = data.list.filter((d) => {
    return d.dt_txt.includes("9:00:00");
  });
  for (let i = 0; i < 5; i++) {
    dayTemArr[i].innerHTML = Math.round(fiveDayFilter[i].main.temp) + "°";
    feelslikeArr[i].innerHTML = `Feels Like : ${Math.round(
      fiveDayFilter[i].main.feels_like
    )}°`;
    highestTemArr[i].innerHTML = `Highest Tem : ${Math.round(
      fiveDayFilter[i].main.temp_max
    )}°`;
    lowestTemArr[i].innerHTML = `Lowest Tem : ${Math.round(
      fiveDayFilter[i].main.temp_min
    )}°`;
    dayIconArr[i].innerHTML = `<img
        src=" http://openweathermap.org/img/wn/${fiveDayFilter[i].weather[0].icon}.png"
       >`;
  }
}

function getWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
      getPhoto(city);
      timeZones(data);
      document.querySelector(".errTap").style.visibility = "hidden";
    })
    .catch((e) => {
      // console.log(e)
      console.log("Invalid city!!");
      document.querySelector(".errTap").style.visibility = "visible";
    });
}

function getPhoto(city) {
  fetch(
    `https://api.unsplash.com/search/photos?client_id=${assessKey}&query=${city}&orientation=portrait`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const getPhoto = data.results[0].urls.regular;
      const leftDiv = document.querySelector(".leftDiv");
      leftDiv.style.backgroundImage = `url(${getPhoto})`;
    })
    .catch((e) => {
      console.log(e);
      console.log("Invalid photo!!");
    });
}

function displayWeather(data) {
  const { name } = data;
  const { temp, feels_like, temp_min, temp_max, humidity } = data.main;
  const { speed } = data.wind;
  const { description, icon } = data.weather[0];
  document.querySelector(".location").innerHTML = name;
  document.querySelector(".weatherIcon").innerHTML = `<img
     src=" http://openweathermap.org/img/wn/${icon}@4x.png"
     alt="${description}">`;
  document.querySelector(".temp").innerHTML = Math.round(temp) + "°";
  document.querySelector(".description").innerHTML = description;
  document.querySelector(".humidityCon").innerHTML = Math.round(humidity) + "%";
  document.querySelector(".windCon").innerHTML = Math.round(speed) + "km/h";
  document.querySelector(".feelslikeCon").innerHTML =
    Math.round(feels_like) + "°";
  document.querySelector(".highestTemCon").innerHTML =
    Math.round(temp_max) + "°";
  document.querySelector(".lowestTemCon").innerHTML =
    Math.round(temp_min) + "°";
  document.querySelector(".locatIcon").innerHTML =
    '<i class="fa-solid fa-location-dot"></i>';
  document.querySelector(".condition").style.visibility = "visible";
}

function success(data) {
  //openCage將latitude,longitude吸 reverse to 地址
  var api_key = openCageAPI;
  var latitude = data.coords.latitude;
  var longitude = data.coords.longitude;
  var api_url = "https://api.opencagedata.com/geocode/v1/json";
  var request_url =
    api_url +
    "?" +
    "key=" +
    api_key +
    "&q=" +
    encodeURIComponent(latitude + "," + longitude) +
    "&pretty=1" +
    "&no_annotations=1";
  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward
  var request = new XMLHttpRequest();
  request.open("GET", request_url, true);
  request.onload = function () {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes
    if (request.status === 200) {
      // Success!
      var data = JSON.parse(request.responseText);
      const cityData = data.results[0].components.city_district;
      getWeather(cityData);
      FiveDayWeather(cityData);
      // print the location
      //把呢個資料自動傳入 html 的資料
    } else if (request.status <= 500) {
      // We reached our target server, but it returned an error
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log("error msg: " + data.status.message);
    } else {
      console.log("server error");
    }
  };
  request.onerror = function () {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };
  request.send(); // make the request
}

navigator.geolocation.getCurrentPosition(success, console.error);
//geolocation API
//success 是一個call back function ,因此會把navigation的資料傳入success的parameter 之中, 所以可拿到相關資料

const time = document.querySelector(".time");
const pmam = document.querySelector(".pmam");
const week = document.querySelector(".week");
const datetime = document.querySelector(".date");

const timeZones = function (data) {
  const offset = data.timezone; // offset in seconds (e.g. UTC+8)
  const date = new Date();
  const utcTimestamp = date.getTime() + date.getTimezoneOffset() * 60 * 1000; // convert to UTC timestamp
  const localTimestamp = utcTimestamp + offset * 1000; // apply offset
  const localDate = new Date(localTimestamp); // create new Date object with local timestamp
  const localTimeString = localDate.toLocaleTimeString("en-US", {
    hour12: false,
    hourCycle: "h24",
    timeStyle: "short",
  }); // format local time as string
  time.innerHTML = localTimeString;

  const now = new Date(localTimestamp);
  const hours = now.getHours();
  pmam.innerHTML = hours >= 12 ? "PM" : "AM";

  const option1 = { weekday: "long" };
  const dateTimeZone = now.toLocaleDateString("en-US", option1);

  const option2 = { day: "numeric" };
  const dayTimeZone = now.toLocaleDateString("en-US", option2);

  const option3 = { month: "long" };
  const monthTimeZone = now.toLocaleDateString("en-US", option3);

  const option4 = { year: "numeric" };
  const yearTimeZone = now.toLocaleDateString("en-US", option4);

  week.innerHTML = dateTimeZone;
  datetime.innerHTML = dayTimeZone + " " + monthTimeZone + " " + yearTimeZone;

  const tomorrow1 = new Date(localTimestamp);
  tomorrow1.setDate(tomorrow1.getDate() + 1);

  const option5 = { weekday: "long" };
  const dateTimeZoneTomorrow = tomorrow1.toLocaleDateString("en-US", option5);

  document.querySelector(".day1").innerHTML = dateTimeZoneTomorrow;

  const tomorrow2 = new Date(localTimestamp);
  tomorrow2.setDate(tomorrow2.getDate() + 2);

  const option6 = { weekday: "long" };
  const dateTimeZoneTomorrow2 = tomorrow2.toLocaleDateString("en-US", option6);

  document.querySelector(".day2").innerHTML = dateTimeZoneTomorrow2;

  const tomorrow3 = new Date(localTimestamp);
  tomorrow3.setDate(tomorrow3.getDate() + 3);

  const option7 = { weekday: "long" };
  const dateTimeZoneTomorrow3 = tomorrow3.toLocaleDateString("en-US", option7);

  document.querySelector(".day3").innerHTML = dateTimeZoneTomorrow3;

  const tomorrow4 = new Date(localTimestamp);
  tomorrow4.setDate(tomorrow4.getDate() + 4);

  const option8 = { weekday: "long" };
  const dateTimeZoneTomorrow4 = tomorrow4.toLocaleDateString("en-US", option8);

  document.querySelector(".day4").innerHTML = dateTimeZoneTomorrow4;

  const tomorrow5 = new Date(localTimestamp);
  tomorrow5.setDate(tomorrow5.getDate() + 5);

  const option9 = { weekday: "long" };
  const dateTimeZoneTomorrow5 = tomorrow5.toLocaleDateString("en-US", option9);

  document.querySelector(".day5").innerHTML = dateTimeZoneTomorrow5;
};
