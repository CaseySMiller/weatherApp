//declare variables
var searchCity = "";
var searchLat = "33.44";
var searchLon = "-94.04";
// define global elements
var searchButton = $('#search-button');

// 8 long array of search history check/store local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
if (!searchHistory) {
    searchHistory = ['Denver, CO', 'New York, NY', 'Las Vegas, NV', 'Boston, MA', 'Los Angles, CA', 'Salt Lake City, UT', 'New Orleans, LA', 'Cheyenne, WY'];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};
// get todays date
var theDate = new Date();

// console.log(theDate.valueOf());

//populate searchHistory to html
function populateHistory () {
    var historyCity = $('div[id=history-button]');

    for (i = 0; i < searchHistory.length; i++) {
        historyCity[i].textContent = searchHistory[i];
    };
};
populateHistory();


// get weather api data
function getWeather () {
    var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + searchLat + '&lon=' + searchLon + 'exclude=minutely,hourly,alerts&appid=57f0ddcddcbf55dbf6cea93885f48c61';
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
};

// function to convert plaintext city to lat/long and pass it to getWeather() function
function getLatLong () {
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchCity + '&limit=1&appid=57f0ddcddcbf55dbf6cea93885f48c61';

    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //store lat and long in variables for getWeather
    });

};
// getWeather();


// get weather data on search click and update searchHistory array and localStorage
searchButton.on('click', function() {
    var searchBar = $('#search-bar').val();
    searchCity = searchBar;
    searchHistory.splice(0, 0, searchCity);
    searchHistory.splice(8, 1);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    populateHistory();
    // getLatLong();
});

