$(document).ready(function(){

  //Initialize local storage of search data as well as gathering weather data (current and 5day)
  $("#searchBtn").on("click",function(event){
      //this stips the button from submitting the form
      event.preventDefault();
      var oldLocations = JSON.parse(window.localStorage.getItem("locations"))||[];
      var newLocation = ($(this)[0].previousSibling.previousSibling.value);
      oldLocations.push(newLocation);
      window.localStorage.setItem('locations',JSON.stringify(oldLocations))
      //run the ajax to get city lat/lng
      renderList();
      ajaxCall1(newLocation);
  });

  //query search location lat/lng from opencagedata geocode
  function ajaxCall1(loc){
    console.log(loc)
    var APIKey = "29af6675a09045828a1222f7eabddf65";
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?q="+loc+"&key="+ 
    APIKey 
    + "&language=en&pretty=1";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
            
    //send this lat/lng data to the second Ajax funtion to get weather
    ajaxCall2(response.results[0].geometry.lat,response.results[0].geometry.lng)
    });
  }
    
  //Query Weather Data From OpenWeather
  function ajaxCall2(lat,lng){
    console.log(lat)
    console.log(lng)

    var APIKey = "d76a54ec670a9ff8425f5e3466754232";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?"+"lat="+ lat + "&lon="+ lng +
    "&exclude={minute,hourly}&appid="+APIKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Log the resulting object for troubleshooting
      console.log(response);

      //Put new object in local storage
      window.localStorage.setItem("weatherArray",JSON.stringify(response))
      var icon = response.current.weather[0].icon;
      // Transfer content to HTML
      $("#city").html("<h1>Current Weather</h1>");
      $("#wind").text(`Wind Speed: ${response.current.wind_speed}`);
      $("#humidity").text("Humidity: " + response.current.humidity);
      $("#currentIcon").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`)
      
      // Convert the temp to fahrenheit
      var tempF = (response.current.temp - 273.15) * 1.80 + 32;

      // add temp content to html
      $("#temp").text("Temperature (K) " + response.current.temp);
      $("#tempF").text("Temperature (F) " + tempF.toFixed(2));

      //add 5 day forecast
      dailyWeather = response.daily;

      dailyWeather.forEach((element,i) => {
        console.log(element.weather[0].icon); 
        console.log(i); 
        var icon = element.weather[0].icon;
        var maxTemp = element.temp.max;
        $(`#day${i+1}`).children("img").attr("src",`http://openweathermap.org/img/wn/${icon}@2x.png`)
        $(`#day${i+1}`).children(".card-body").append(`<h5 class="card-title">Date</h5>`)
        $(`#day${i+1}`).children(".card-body").append(`<p class="card-text">Max Temp</p>`)
        $(`#day${i+1}`).children(".card-body").append(`<p class="card-text">Min Temp</p>`)
        $(`#day${i+1}`).children(".card-body").append(`<p class="card-text">Humidity</p>`)
      });
    });
  }

  //render list and prepend each new search result 
  function renderList(){
    var searchHist = JSON.parse(window.localStorage.getItem("locations"));
    $(".list-group").empty()

    searchHist.forEach(element => {
      $(".list-group").prepend(`<li class="list-group-item">${element}</li>`)
    });
  }

});