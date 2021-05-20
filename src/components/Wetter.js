import '../assets/css/wetter.css';
import {React, Component} from 'react';
import axios from 'axios';

const
    API_URL = process.env.REACT_APP_WEATHER_API_URL,
    API_KEY = process.env.REACT_APP_WEATHER_API_KEY,
    SUMMER_TEMPERATURE = process.env.REACT_APP_SUMMER_TEMPERATURE

class Wetter extends Component {
    state = {
        weather: null,
        error: null
    }
    onSubmit = (e) => {
        e.preventDefault();
        let city = document.getElementById('city').value;
        if( "" !== city ) {
            this.getWeather(city);
        }
    }
    getWeather(city) {
        const url = API_URL + "?q=" + city + ",de&lang=de&units=metric&APPID=" + API_KEY;
        axios
            .get(url)
            .then(res => {
                // @todos:
                // - check response code 200
                // - set states (setState) for weather, error
                // - get temparatur
                // - set container classes for summer if temperatur >= 18 or winter if lower
                if(200 === res.data.cod) {
                    let wetter = res.data;
                    console.info(res.data);
                    this.setState({weather: wetter, error: null})
                    let temp = wetter.main.temp
                    if(temp >= SUMMER_TEMPERATURE) {
                        document.querySelector('.container').className = "container sommer"
                    } else {
                        document.querySelector('.container').className = "container winter"
                    }
                }
            })
            .catch(err => {
                if(err.response && undefined !== err.response.data.message) {
                    // @todo:
                    // - set setState for error (err.response.data)
                    this.setState({weather: null, error: err.response.data.message})
                }
            });
    }
    render() {
        return (
            <div className="container">
                <h3>Mein Wetter</h3>
                <form onSubmit={this.onSubmit}>
                    <input id="city" className="city" />
                    <button>Suche</button>
                </form>
                <WeatherData weather={this.state.weather} error={this.state.error} />
            </div>
        );
    }
}

function zeroFill(val) {
    return (val < 10 ? '0' : '') + val;
}

function WeatherData(props) {
    const w = props.weather, err = props.error;

    if (null !== err) {
        return (
            <div>
                <h3>{err}</h3>
            </div>
        )
    }
    else if(null !== w) {
        let temp        = Math.round(w.main.temp),
            description = w.weather[0].description,
            iconURL     = "http://openweathermap.org/img/w/" + w.weather[0].icon + ".png",
            dateSunrise = new Date(w.sys.sunrise * 1000),
            dateSunset  = new Date(w.sys.sunset * 1000),
            sunrise     = dateSunrise.getHours() + ":" + zeroFill(dateSunrise.getMinutes()),
            sunset      = dateSunset.getHours() + ":" + zeroFill(dateSunset.getMinutes());

        return (<div className="result">
            <div className="temp">
                <span>{temp} °C</span>
            </div>
            <div className="description">
                <p><img src={iconURL} height="80" alt={description} title={description} /> {description}</p>
            </div>
            <div className="sun">
                <div><span>Sonnenaufgang {sunrise} Uhr</span></div>
                <div><span>Sonnenuntergang {sunset} Uhr</span></div>
            </div>
        </div>);
    }
    else {
        return (<div><h5>Bitte einen Ort angeben!</h5></div>)
    }
}
export default Wetter;
