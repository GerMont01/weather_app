import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context";

export default function Weather(props) {
    const [city, setCity] = useState(props.city);

    const data = useContext(Context);
    return(

        <div className="weather" onClick={()=> data.fetchForcastAndSightseeing(city.name)} key={city.id + 'weather'}>
            <h2>{city.date} {city.time}</h2>
            <div className="temp">
            {(data.unit === 'C') ? (
            <>
                <span className="temp1">{city.temp}°{data.unit}</span><br /><span>{city.temp_min}°-{city.temp_max}°{data.unit}</span>
            </>
            ):(
            <>
                <span className="temp1">{Math.round((city.temp* 9/5) + 32)}°{data.unit}</span><br /><span>{Math.round((city.temp_min* 9/5) + 32)}°-{Math.round((city.temp_max* 9/5) + 32)}°{data.unit}</span>
            </>
            )}
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
    )
}