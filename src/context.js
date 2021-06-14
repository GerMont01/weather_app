import React from "react";
import uuid from "react-uuid";
import './context.css';

const Context = React.createContext();

export default class Provider extends React.Component {
    state = {
        cities: [],
        unit:'C',
        units:'metric',
        forecast: {
            name: '',
            country: '',
            data: []
        },
        showForecast: false,
        handleDelete: (id) => {
            let newCities = this.state;
            newCities.cities = newCities.cities.filter((city)=>city.id!==id);
            this.setState(newCities);
        },
        handleForcast: (name) => {
            this.forecastCity(name);
            let newState = this.state;
            newState.showForecast = true;
            this.setState(newState);
        },
        handleForcastStatus: () => {
            let newState = this.state;
            newState.showForecast = false;
            this.setState(newState);
        }
    };
    getSunRise(epoch){
        let d = new Date(epoch *1000);
        let h = d.getUTCHours();
        let m = d.getUTCMinutes();
        return `${h}:${m}`
    }
    convertDate(offset) {
        let current = new Date().getTime() / 1000
        let epoch = current + offset;
        let d = new Date(epoch *1000);
        let day = d.getUTCDate();
        let month = d.getUTCMonth() + 1;
        let year = d.getUTCFullYear();
        return `${month}/${day}/${year}`
    }
    convertTime(offset) {
        let current = new Date().getTime() / 1000
        let epoch = current + offset;
        let d = new Date(epoch *1000);
        let h = d.getUTCHours();
        let m = d.getUTCMinutes();
        return `${h}:${m}`
    }
  
    fetchData(cityname) {
        console.log(this.state)
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=${this.state.units}&appid=bced9de0c38c91650f8270abf3db9fed`).then(response => {
            if(response.status !== 200) {
                console.log(`We have some errors ${response.status}`);
                return;
            }
            response.json().then(city => {
                const cityData = {
                    id: uuid(),
                    description : city.weather[0].description.charAt(0).toUpperCase() + city.weather[0].description.slice(1),
                    name : cityname.charAt(0).toUpperCase() + cityname.slice(1),
                    country : city.sys.country,
                    temp : Math.round(city.main.temp),
                    temp_min : Math.round(city.main.temp_min),
                    temp_max : Math.round(city.main.temp_max),
                    humidity : city.main.humidity,
                    date : this.convertDate(city.timezone),
                    time : this.convertTime(city.timezone),
                    sunrise : this.getSunRise(city.sys.sunrise + city.timezone),
                    sunset : this.getSunRise(city.sys.sunset + city.timezone),
                    iconurl : `https://openweathermap.org/img/w/${city.weather[0].icon}.png`
                }
                if (cityData.name.length > 9){
                    cityData.name= cityData.name.substring(0, 9)
                } 
                this.state.units === 'metric' ? this.setState({unit: 'C'}) : this.setState({unit: 'F'})
                let usedCities = this.state.cities;
                if (!usedCities.some((city)=>city.name===cityData.name)) {
                    usedCities.push(cityData);
                    this.setState(usedCities);
                }
            }).catch(err => {
                console.log(`We have some error ${err}`)
            })
        })
    }
    forecastCity(cityname) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&cnt=8&appid=bced9de0c38c91650f8270abf3db9fed`).then(response => {
            if(response.status !== 200) {
                console.log(`We have some errors ${response.status}`);
                return;
            }
            response.json().then(cityforecast => {
                const forecast = {
                    name : cityname.charAt(0).toUpperCase() + cityname.slice(1),
                    country: cityforecast.city.country,
                    data: []
                }
                if (forecast.name.length > 9){
                    forecast.name= forecast.name.substring(0, 9)
                } 
                //Loop to get data from every 3 hours and append each element to table 
                for (let i=0;i<8;i++){
                    let x = {
                        description: cityforecast.list[i].weather[0].description.charAt(0).toUpperCase() + cityforecast.list[i].weather[0].description.slice(1),
                        temp: Math.round(cityforecast.list[i].main.temp),
                        humidity: cityforecast.list[i].main.humidity,
                        time: cityforecast.list[i].dt_txt,
                        iconurl: `https://openweathermap.org/img/w/${cityforecast.list[i].weather[0].icon}.png`
                    }
                    forecast.data.push(x);
                }
                let newState = this.state;
                newState.forecast = forecast;
                this.setState(newState);
            }).catch(err => {
                console.log(`We have some error ${err}`)
            })
        })
    }
    render() {
        return (
            <Context.Provider value={this.state}>
                <div id='searchbar'>
                    <i className="fas fa-search"></i>
                    <input onKeyDown={(e)=>{if(e.key === 'Enter'){this.fetchData(e.target.value); e.target.value=''}}} type="text" id="addCity" placeholder="Add City" autoComplete='off'/>
                </div>
                {this.props.children}
            </Context.Provider>
        )
    }
}
    
export const Consumer = Context.Consumer;
  