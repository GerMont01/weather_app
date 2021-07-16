import React from "react";
import uuid from "react-uuid";
import './context.css';
import Refresh from './icons/refresh.svg';

export const Context = React.createContext();
// Reducer --------------------------------------------------------------------
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CITY':
            if (!state.cities.some((city)=>city.name===action.payload.name)) {
                state.cities.push(action.payload);
            }
            localStorage.setItem('cities',JSON.stringify(state.cities));
            return {
                ...state,
            };
        case 'DELETE':
            state.cities = state.cities.filter((city)=>city.id!==action.payload)
            localStorage.setItem('cities',JSON.stringify(state.cities));
            return {
                ...state
            };
          case 'TOGGLE_FORECAST':
              return {
                  ...state,
                  showForecast: false
              }
          case 'TOGGLE_SIGHTSEEING':
                return {
                    ...state,
                    showSightseeing: false
                }
          case 'CHANGE_BASE#':
            for (let city of state.cities) {
                if (city.id === action.payload.id) {
                    city.base_amount = action.payload.amount;
                }
            }
              return {
                  ...state
              }
          case 'ACTIVE_TAB':
              return {
                  ...state,
                  active: action.payload
              }
          case 'EMPTY_S':
            return {
                ...state,
                sightseeing: []
            }
          default:
              return {
                  ...state
              };
        };
}

// Component -------------------------------------------------------------------------
export default class Provider extends React.Component {
    state = {
        
        cities:[],
        unit:'C',
        units:'metric',
        forecast: {
            name: '',
            country: '',
            data: []
        },
        sightseeing: [],
        showForecast: false,
        showSightseeing: false,
        active: 'weather',
        base: 'CAD',
        handleForcast: (name) => {
            this.forecastCity(name);
            let newState = this.state;
            newState.showForecast = true;
            this.setState(newState);
        },
        handleSightseeing: (name) => {
            this.getSightseeing(name);
            let newState = this.state;
            newState.showSightseeing = true;
            this.setState(newState);
        },
        dispatch: (action) => {
            this.setState((state) => reducer(state, action));
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
                    iconurl : `https://openweathermap.org/img/w/${city.weather[0].icon}.png`,
                    base_amount:1,
                    rate: 0,
                    code: ''
                }
                if (cityData.name.length > 9){
                    cityData.name= cityData.name.substring(0, 9)
                }
                this.state.units === 'metric' ? this.setState({unit: 'C'}) : this.setState({unit: 'F'}) 
                this.getCurrency(city.sys.country).then(amount => {
                    cityData.rate = amount.rate;
                    cityData.code = amount.currency_code;
                    this.state.dispatch({ type:'ADD_CITY', payload: cityData});
                });
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
                this.setState({forecast:forecast});
            }).catch(err => {
                console.log(`We have some error ${err}`)
            })
        })
    }

    async getCurrency(country) {
        try {
            const fetch_country = await fetch(`https://restcountries.eu/rest/v2/alpha/${country}`);
            const json_country = await fetch_country.json();
            const country_name = await json_country.name;
            const fetch_currency = await fetch('https://pkgstore.datahub.io/JohnSnowLabs/iso-4217-currency-codes/iso-4217-currency-codes-csv_json/data/248f953387d4218576d846696fc54adf/iso-4217-currency-codes-csv_json.json')
            const currency_json = await fetch_currency.json();
            const country_data = currency_json.find(data => data.Entity.toLowerCase().includes(country_name.toLowerCase()) === true);
            const currency_code = country_data.Alphabetic_Code;
            const fetch_exchange = await fetch(`https://v6.exchangerate-api.com/v6/e383d57ae359f0928f0da2d2/pair/${this.state.base}/${currency_code}`);
            const json_exchange = await fetch_exchange.json();
            const rate = json_exchange.conversion_rate;
            if (rate){
                return {currency_code, rate};
            } 
        }
        catch(error) {
            console.log(error)
        }
    }

    async getSightseeing(cityname) {
        const api_key1 = '5ae2e3f221c38a28845f05b669931f2de602806c1d15cc8f826b0d32';
        try {
            const fetch_Coord = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=bced9de0c38c91650f8270abf3db9fed`);
            const coord_json = await fetch_Coord.json();
            const lon = coord_json.coord.lon;
            const lat = coord_json.coord.lat;
            const fetch_Sightseeing = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&rate=3&limit=5&apikey=${api_key1}`);
            const sightseeing_json = await fetch_Sightseeing.json();
            const currentSights = this.state.sightseeing;
            for (let i=0;i<5;i++) {
                let id = sightseeing_json.features[i].properties.xid;
                const fetch_sights = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${api_key1}`);
                const sights_json = await fetch_sights.json();
                if (sights_json.wikipedia_extracts) {
                    const sights = {
                        content: sights_json.wikipedia_extracts.html,
                        sight: sights_json.name,
                        image: sights_json.preview.source
                    };
                    currentSights.push(sights); 
                }
            } 
            this.setState({
                sightseeing: currentSights
            }); 
        }
        catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        if (localStorage.getItem('cities')){
            JSON.parse(localStorage.getItem('cities')).map(city => this.fetchData(city.name))
        }
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                <img className='refresh' alt='' src={Refresh} onClick={()=>window.location.reload()}/>
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
  