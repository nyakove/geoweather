////////////////////////CODE FOR GEOLOCATION: START

let options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 10000
};

function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude: ${crd.latitude.toFixed(3)}`);
    console.log(`Longitude: ${crd.longitude.toFixed(3)}`);
    try {
        reverseGeocode(crd.latitude.toFixed(3), crd.longitude.toFixed(3));
        getWeather(crd.latitude.toFixed(3), crd.longitude.toFixed(3));
    } catch (err) {
        console.log(err);
    }
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    /////////////////////request to get IP
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.ipify.org/', true)
    xhr.send();
    setTimeout(function () {
        IP = xhr.responseText;
        console.log(IP);
        IPstack(IP);
        return IP;
    }, 700);

};

navigator.geolocation.getCurrentPosition(success, error, options);

function IPstack(ip) {
    let IP = ip;
    let xhr2 = new XMLHttpRequest();
    const IPSTACK_KEY = '4089f1c82ced7a19ba148ef450766426';
    let URL = `http://api.ipstack.com/${IP}?access_key=${IPSTACK_KEY}`
    xhr2.open('GET', URL, true);
    xhr2.send()

    setTimeout(function () {

        let response = JSON.parse(xhr2.responseText);
        console.log('Your current position is:');
        console.log(`Latitude: ${response.latitude.toFixed(3)}`);
        console.log(`Longitude: ${response.longitude.toFixed(3)}`);
        document.querySelector('#city > span').innerText = response.city;
        try {
            getWeather(response.latitude.toFixed(3), response.longitude.toFixed(3));
        } catch (err) {
            console.log(err)
        };

    }, 1000)
}

////////////////////////CODE FOR GEOLOCATION: END

const geoCode = async () => {
    const GOOGLE_API_KEY = 'AIzaSyAPE06HkAar4Cj751xJ0nGsVUwhj_sOSaY';
    let address = (document.querySelector('#address').value).replace(/ /g, '+');
    let URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.send();

    setTimeout(function () {

        try {
            let json = xhr.responseText;
            let parsed = JSON.parse(json);

            let lat = parseFloat(parsed.results[0].geometry.location.lat.toFixed(7));
            let lng = parseFloat(parsed.results[0].geometry.location.lng.toFixed(7));

            console.log(`Coordinates: ${lat}, ${lng}`);
            console.log(`Full address: ${parsed.results[0].formatted_address}`);
            let city = '';

            for (i of parsed.results[0].address_components) {
                if (i.types[0] == 'locality') {
                    city = i.long_name;
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'colloquial_area') {
                        city = i.long_name;
                    }
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'administrative_area_level_1') {
                        city = i.long_name;
                    }
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'country') {
                        city = i.long_name;
                    }
                }
            }

            document.querySelector('#city > span').innerText = city;
            getWeather(lat, lng);

        } catch (err) {
            console.error(`Error founded: ${err.message}`);
        }
    }, 1000);
}

const getWeather = (latitude, longitude) => {

    const OPEN_WEATHER_KEY = 'a59f8c595a7e6b1572e3cd0398b37a1d';

    latitude = +parseFloat(latitude).toFixed(2);
    longitude = +parseFloat(longitude).toFixed(2);
    console.log(latitude + "," + longitude);

    let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.send();

    setTimeout(function () {

        try {
            let response = (JSON.parse(xhr.responseText));
            console.warn(`Info updated: ${(new Date()).toLocaleString()}`)
            document.querySelector('#icon > img').src = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
            document.querySelector('#icon > img').title = `${response.weather[0].description}`;

            let temp = (response.main.temp).toFixed();
            if (temp == '-0') {
                temp = 0;
            };
            if (temp > 0) {
                temp = `+${temp}`;
            };
            document.querySelector('#temp > h1').innerText = `${temp}°`;

        } catch (err) {
            console.error(`Error founded: ${err.message}`);
        }
    }, 500);
}

const reverseGeocode = (lat, lng) => {
    const GOOGLE_API_KEY = 'AIzaSyAPE06HkAar4Cj751xJ0nGsVUwhj_sOSaY';

    let URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL, true);
    xhr.send();

    setTimeout(function () {
        try {
            let json = xhr.responseText;
            let parsed = JSON.parse(json);

            for (i of parsed.results[0].address_components) {
                if (i.types[0] == 'locality') {
                    city = i.long_name;
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'colloquial_area') {
                        city = i.long_name;
                    }
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'administrative_area_level_1') {
                        city = i.long_name;
                    }
                }
            }

            if (city == '') {
                for (i of parsed.results[0].address_components) {
                    if (i.types[0] == 'country') {
                        city = i.long_name;
                    }
                }
            }
            document.querySelector('#city > span').innerText = city;
        } catch (err) {
            console.error(`Error founded: ${err.message}`);
        }
    }, 700)
}
