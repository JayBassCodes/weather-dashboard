function startup() {

    //variable block
    let input = document.getElementById("city-input");
    let searchButton = document.getElementById("search-button");
    let clearHistory = document.getElementById("clear-history");
    let nameEl = document.getElementById("city-name");
    let currentPic = document.getElementById("current-pic");
    let temperature = document.getElementById("temperature");
    let humidity = document.getElementById("humidity"); 4
    let windSpeed = document.getElementById("wind-speed");
    let currentUV = document.getElementById("UV-index");
    let historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    input
    // api key
    const apiKey = '234f56f56280fd0175d6b3731e4e6ba3';

    function weatherCall(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
        axios.get(queryURL)
            .then(function (response) {
                let currentDate = new Date(response.data.dt * 1000);
                console.log(currentDate);
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPic.setAttribute("alt", response.data.weather[0].description);
                temperature.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                windSpeed.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVIndex = document.createElement("span");
                        UVIndex.setAttribute("class", "badge badge-danger");
                        UVIndex.innerHTML = response.data[0].value;
                        currentUV.innerHTML = "UV Index: ";
                        currentUV.append(UVIndex);
                    });

                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        let forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            let forecastIndex = i * 8 + 4;
                            let forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            let forecastDay = forecastDate.getDate();
                            let forecastMonth = forecastDate.getMonth() + 1;
                            let forecastYear = forecastDate.getFullYear();
                            let forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);
                            let forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl);
                            let forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            let forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }
    searchButton.addEventListener("click",function() {
        const searchTerm = input.value;
        weatherCall(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clearHistory.addEventListener("click",function() {
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                weatherCall(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        weatherCall(searchHistory[searchHistory.length - 1]);
    }


}
initPage();