$(document).ready(function(){

  //render previous searches if there are any saved in local storage  
  if(window.localStorage.getItem("locations")!=null){
    renderList();
    var oldLocations = JSON.parse(window.localStorage.getItem("locations"))||[];
    length = oldLocations.length;
    console.log(oldLocations)
    ajaxCall1(oldLocations[length-1])
  }

  $(".list-group-item").on("click",function(){
    ajaxCall1($(this).text());
  });

  //Initialize local storage of search data as well as gathering weather data (current and 5day)
  $("#searchBtn").on("click",function(event){
    //this stops the button from submitting the form
    event.preventDefault();

    //store location search history in local storage
    var oldLocations = JSON.parse(window.localStorage.getItem("locations"))||[];
    var newLocation = ($(this)[0].previousSibling.previousSibling.value);

    //Clear the search once we have transfered the values
    $("#searchInput").val("");
    oldLocations.push(newLocation);
    window.localStorage.setItem('locations',JSON.stringify(oldLocations));

    //render the search list 
    addListItem(newLocation);
    
    //run the ajax to get location lat/lng
    ajaxCall1(newLocation);
  });

  //query search location lat/lng from opencagedata geocode
  function ajaxCall1(loc){
    var APIKey = "29af6675a09045828a1222f7eabddf65";
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?q="+loc+"&key="+ 
    APIKey 
    + "&language=en&pretty=1";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
            
    //send this lat/lng data to the second Ajax funtion to get weather
    ajaxCall2(loc,response.results[0].geometry.lat,response.results[0].geometry.lng)
    });
  }
    
  //Query Weather Data From OpenWeather
  function ajaxCall2(loc,lat,lng){
    var APIKey = "d76a54ec670a9ff8425f5e3466754232";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?"+"lat="+ lat + "&lon="+ lng +
    "&exclude={minute,hourly}&appid="+APIKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Log the resulting object for troubleshooting
      //console.log(response);

      //Put new object in local storage
      var icon = response.current.weather[0].icon;
      var date =moment.unix(response.current.dt).format("MMM Do") ;
      // Transfer content to HTML
      $("#city").html(`<h1>${loc}</h1>`);
      $("#date").html(`<h5>${date}</h5>`);
      $("#wind").text(`Wind Speed: ${response.current.wind_speed}`);
      $("#humidity").text("Humidity: " + response.current.humidity);
      $("#uvIndex").html(`UV Index: <span class="badge badge-secondary">${response.current.uvi}</span>`);
      uviColor(response.current.uvi)
      $("#currentIcon").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`)
      
      // Convert the temp to fahrenheit
      var tempF = (response.current.temp - 273.15) * 1.80 + 32;
      $("#tempF").text("Temperature (F) " + tempF.toFixed(2));

      //add 5 day forecast
      dailyWeather = response.daily;
      clearForecast(dailyWeather);

      dailyWeather.forEach((element,i) => {
        var date =moment.unix(element.dt).format("MMM Do") ;
        var icon = element.weather[0].icon;
        var maxTemp = (element.temp.max- 273.15) * 1.80 + 32;
        var minTemp = (element.temp.min- 273.15) * 1.80 + 32;
        var humidity = element.humidity;
        $(`#day${i+1}`).attr("src",`http://openweathermap.org/img/wn/${icon}@2x.png`)
        $(`#day${i+1}`).siblings(".card-body").append(`<h5 class="card-title">${date}</h5>`)
        $(`#day${i+1}`).siblings(".card-body").append(`<p class="card-text">Max Temp(F): ${maxTemp.toFixed(2)}</p>`)
        $(`#day${i+1}`).siblings(".card-body").append(`<p class="card-text">Min Temp(F): ${minTemp.toFixed(2)}</p>`)
        $(`#day${i+1}`).siblings(".card-body").append(`<p class="card-text">Humidity: ${humidity}</p>`)
      });
    });
  }

  //render list and prepend each new search result 
  function renderList(){
    var searchHist = JSON.parse(window.localStorage.getItem("locations"));
    $(".list-group").empty();

    searchHist.forEach(element => {
      $(".list-group").prepend(`<li class="list-group-item">${element}</li>`)
    });
  }

  function addListItem(loc){
    $(".list-group").prepend(`<li class="list-group-item">${loc}</li>`)
  }

  //Use this function to determin UV Inex badge color
  function uviColor(uvi){
    if(0<uvi && uvi<3){
      $(".badge").attr("style","background-color:#a0ce00")
    }
    else if(3<=uvi && uvi<6){
      $(".badge").attr("style","background-color:#f8b600")
    }
    else if(6<=uvi && uvi<8){
      $(".badge").attr("style","background-color:#f85900")
    }
    else if(8<=uvi && uvi<11){
      $(".badge").attr("style","background-color:#d8001d")
    }
    else{
      $(".badge").attr("style","background-color:#b54cff")
    }
  }

  //clear the 5 day forecast before each new city is rendered
  function clearForecast(array){
    array.forEach((element,i) => {
      $(`#day${i+1}`).siblings(".card-body").empty();
      $(`#day${i+1}`).siblings(".card-body").empty();
      $(`#day${i+1}`).siblings(".card-body").empty();
      $(`#day${i+1}`).siblings(".card-body").empty();
    });
  }

});