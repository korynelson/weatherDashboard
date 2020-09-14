$("searchBtn").on("click",function(){

    $.ajax({
        url: "https://api.opencagedata.com/geocode/v1/json?q=seattle,wa&key=29af6675a09045828a1222f7eabddf65",
        method:"GET"
    })
    .then(function(response) {
        console.log(response.results[0].geometry);
        ajaxCall2(response.results[0].geometry.lat,response.results[0].geometry.lng)
    });

})


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
  })
  .then(function(response) {

    // Log the resulting object
    console.log(response);

    //Put new object in local storage
    window.localStorage.setItem("weatherArray",JSON.stringify(response))

    // Transfer content to HTML
    $("#city").html("<h1>Current Weather</h1>");
    $("#wind").text("Wind Speed: " + response.current.wind_speed);
    $("#humidity").text("Humidity: " + response.current.humidity);
    
    // Convert the temp to fahrenheit
    var tempF = (response.current.temp - 273.15) * 1.80 + 32;

    // add temp content to html
    $("#temp").text("Temperature (K) " + response.current.temp);
    $("#tempF").text("Temperature (F) " + tempF.toFixed(2));
  });
}

