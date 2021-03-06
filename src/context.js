import React from "react";
import uuid from "react-uuid";
import BgImage from "./icons/background1.jpg"

export const Context = React.createContext();
// Reducer --------------------------------------------------------------------
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CITY':
            if (!state.cities.some((city)=>city.name===action.payload.name)) {
                state.cities.push(action.payload);
            }
            localStorage.setItem('data',JSON.stringify(state));
            return {
                ...state,
            };
        case 'DELETE':
            state.cities = state.cities.filter((city)=>city.id!==action.payload)
            localStorage.setItem('data',JSON.stringify(state));
            return {
                ...state
            };
        case 'TOGGLE_FORECAST':
            return {
                ...state,
                showForecast: action.payload
            }
        case 'TOGGLE_SIGHTSEEING':
            return {
                ...state,
                showSightseeing: action.payload
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
        case 'SET_BASE':
            state.handleCurrency(action.payload);
            return {
                ...state,
                base: action.payload
            }
        case 'SET_UNIT':
            return {
                ...state,
                unit: action.payload
            }
        case 'TOGGLE_SETTINGS':
            return {
                ...state,
                settings: action.payload
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
        settings: false,
        cities:[],
        unit: 'C',
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
        fetchForcastAndSightseeing: (name) => {
            this.forecastCity(name);
            this.getSightseeing(name);
            let newState = this.state;
            newState.showForecast = true;
            this.setState(newState);
        },
        handlefetchData: (cityname) => {
            this.fetchData(cityname);
        }, 
        handleCurrency: (base) => {
            let newCities = this.state.cities;
            for (let city of newCities) {
                this.getCurrency(city.country, base).then(amount => {
                    city.rate = amount.rate;
                    this.setState({cities: newCities});
                    localStorage.setItem('data',JSON.stringify(this.state));
                }).catch(err => {
                    alert('Enter a valid currency code')
                    console.log(`We have some error ${err}`)
                }) 
            }  
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
                this.getCurrency(city.sys.country, this.state.base).then(amount => {
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
            response.json().then(cityforecast => {
                const forecast = {
                    name : cityname.charAt(0).toUpperCase() + cityname.slice(1),
                    country: cityforecast.city.country,
                    data: []
                }
                if (forecast.name.length > 9){
                    forecast.name= forecast.name.substring(0, 9)
                } 
                for (let i=0;i<8;i++){
                    let x = {
                        description: cityforecast.list[i].weather[0].description.charAt(0).toUpperCase() + cityforecast.list[i].weather[0].description.slice(1),
                        temp: Math.round(cityforecast.list[i].main.temp),
                        humidity: cityforecast.list[i].main.humidity,
                        time: cityforecast.list[i].dt,
                        timezone: cityforecast.city.timezone,
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

    async getCurrency(country,base) {
        try {
            const fetch_country = await fetch(`https://restcountries.com/v2/alpha/${country}`);
            const json_country = await fetch_country.json();
            const country_name = await json_country.name;
            const fetch_currency = await fetch('https://pkgstore.datahub.io/JohnSnowLabs/iso-4217-currency-codes/iso-4217-currency-codes-csv_json/data/248f953387d4218576d846696fc54adf/iso-4217-currency-codes-csv_json.json')
            const currency_json = await fetch_currency.json();
            const country_data = currency_json.find(data => data.Entity.toLowerCase().includes(country_name.toLowerCase()) === true);
            const currency_code = country_data.Alphabetic_Code;
            const fetch_exchange = await fetch(`https://v6.exchangerate-api.com/v6/e383d57ae359f0928f0da2d2/pair/${base}/${currency_code}`);
            const json_exchange = await fetch_exchange.json();
            const rate = json_exchange.conversion_rate;
            if (rate){
                return {currency_code, rate};
            } 
        }
        catch(error) {
            alert('Enter a valid currency code')
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
        if (localStorage.getItem('data')){
            JSON.parse(localStorage.getItem('data')).cities.map(city => this.fetchData(city.name));
            this.setState({ base: JSON.parse(localStorage.getItem('data')).base });
        }
        if (localStorage.getItem('background')) {
            document.getElementById('body').style.backgroundImage = "url(" + localStorage.getItem('background') + ")";
        } else {
            document.getElementById('body').style.backgroundImage = `url(${BgImage})`;
        }
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}
    
export const Consumer = Context.Consumer;
  
