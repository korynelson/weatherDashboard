// This is our API key
var APIKey = "d76a54ec670a9ff8425f5e3466754232";

// Here we are building the URL we need to query the database
var queryURLWeather = "https://api.openweathermap.org/data/2.5/" + "weather?" +
  "q=Seattle,Washington&appid=" + APIKey;
  var queryURLForecast = "https://api.openweathermap.org/data/2.5/" + "forecast?" +
  "q=Seattle,Washington&appid=" + APIKey;

//Query Current Weather
  $.ajax({
    url: queryURLWeather,
    method: "GET"
  })
  .then(function(response) {

    // Log the queryURL
    console.log(queryURLWeather);

    // Log the resulting object
    console.log(response);

    // Transfer content to HTML
    $("#city").html("<h1>" + response.name + " Weather Details</h1>");
    $("#wind").text("Wind Speed: " + response.wind.speed);
    $("#humidity").text("Humidity: " + response.main.humidity);
    
    // Convert the temp to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;

    // add temp content to html
    $("#temp").text("Temperature (K) " + response.main.temp);
    $("#tempF").text("Temperature (F) " + tempF.toFixed(2));

    // Log the data in the console as well
    console.log("Wind Speed: " + response.wind.speed);
    console.log("Humidity: " + response.main.humidity);
    console.log("Temperature (F): " + tempF);
  });

  //Query 5 Day Forecast
  $.ajax({
    url: queryURLForecast,
    method: "GET"
  })
  .then(function(response) {
    // Log the queryURL
    console.log(queryURLForecast);

    // Log the resulting object
    var day = moment.unix(response.list[1].dt).format('MMM Do')
    $("#day1").html("<h1>" + day + "</h1>")
  });
