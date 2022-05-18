// 8 long array of search history check/store local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
if (!searchHistory) {
    searchHistory = ['Denver, CO', 'New York, NY', 'Las Vegas, NV', 'Boston, MA', 'Los Angles, CA', 'Salt Lake City, UT', 'New Orleans, LA', 'Cheyenne, WY'];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};
//declare variables
var searchCity = searchHistory[0];
var searchLat = "";
var searchLon = "";
var cityName = "";
var stateName = "";
var todayDate = "today";
// define global elements
var searchButton = $('#search-button');
var nameAndDate = $('#name-and-date');
var currentTemp = $('#current-temp');
var currentWind = $('#current-wind');
var currentHumid = $('#current-humid');
var currentUvi = $('#current-uvi');
var historyCity = $('div[id=history-button]');


//fetch data for most recent search
getLatLong();
//populate searchHistory to html
function populateHistory () {

    for (i = 0; i < searchHistory.length; i++) {
        historyCity[i].textContent = searchHistory[i];
        // console.log(historyCity[i]);
    };
};
populateHistory();

//function to convert UNIX timstamp
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + '/' + date + '/' + year;
  return time;
}
// console.log(timeConverter(1652889600));


// get weather api data and populate html
function getWeather () {
  var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + searchLat + '&lon=' + searchLon + '&exclude=minutely,hourly,alerts&units=imperial&appid=57f0ddcddcbf55dbf6cea93885f48c61';
  fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    //parse date
    todayDate = timeConverter(data.current.dt);
    // add city state and date
    nameAndDate.text(cityName + ', ' + stateName + ': ' + todayDate + " Current Weather ");
    // add weather icon
    var iconCode = data.current.weather[0].icon;
    var theTemp = data.current.temp;
    var theWind = data.current.wind_speed;
    var theHumid = data.current.humidity;
    var theUvi = data.current.uvi;
    var theIcon = $('<img>');
    theIcon.addClass('light-blue-bg rounded-circle mt-2');
    theIcon.attr('src', 'https://openweathermap.org/img/w/' + iconCode + '.png');
    theIcon.attr('alt', 'weather icon');
    nameAndDate.append(theIcon);
    //populate the rest of the data for current day
    currentTemp.text(theTemp);
    currentWind.text(theWind);
    currentHumid.text(theHumid);
    currentUvi.text(theUvi);
    //color code the UVI
    if (theUvi > 5) {
      currentUvi.removeClass('btn-success btn-warning');
      currentUvi.addClass('btn-danger');
    } else if (theUvi < 3) {
      currentUvi.removeClass('btn-danger btn-warning');
      currentUvi.addClass('btn-success');
    } else {
      currentUvi.removeClass('btn-danger btn-success');
      currentUvi.addClass('btn-warning');
    }

    });
};

// function to convert plaintext city to lat/long and pass it to getWeather() function
function getLatLong () {
    //remove spaces from string
    var searchCityString = searchCity.replace(/ /g, "%20");
    //api request
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchCityString + ',us&limit=1&appid=57f0ddcddcbf55dbf6cea93885f48c61';
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //store data in global variables variables
      searchLat = data[0].lat;
      searchLon = data[0].lon;
      cityName = data[0].name;
      stateName = data[0].state;
      // call function to get the weather
      getWeather();
    });
};

// get weather data on search click and update searchHistory array and localStorage
searchButton.on('click', function() {
    var searchBar = $('#search-bar').val();
    $('#search-bar').val('');
    // set searchCity var to current search
    searchCity = searchBar;
    // update array and localStorage with new city
    searchHistory.splice(0, 0, searchCity);
    searchHistory.splice(8, 1);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    populateHistory();
    getLatLong();
});

// search for city from history on click event
historyCity.on('click', function(event) {
  searchCity = event.target.innerText;
  getLatLong();
});
