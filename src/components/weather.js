import React from "react";
import { Consumer } from "../context";

export default function Weather(props) {
    const city = props.city;
    return(
        <Consumer>
            {(value) => (
            <>
                <div className="weather" onClick={()=>value.handleForcast(city.name)} key={city.id + 'weather'}>
                    <h2>{city.date} {city.time}</h2>
                    <div className="temp">
                        <span className="temp1">{city.temp}°{city.unit}</span><br /><span>{city.temp_min}°-{city.temp_max}°{city.unit}</span>
                    </div>
                    <div className="desc">
                        <img src={city.iconurl} /><span>{city.description}</span>
                    </div>
                    <div className="sun">
                        <i className="fas fa-sun"></i><span>{city.sunrise}</span><br />
                        <i className="far fa-moon"></i><span>{city.sunset}</span>
                    </div>
                    <div className="humidity">
                        <i className="fas fa-tint"></i><span> {city.humidity}%</span>
                    </div>
                </div>
            </>
            )}
        </Consumer>
    )
}