import React from "react";
import { Consumer } from "../context";
import './weather.scss'
import Close from '../icons/close.svg'

export default function Weather() {
    return(
        <Consumer>
            {(value) => (
            <>
            {value.cities.map((city) => (
            <div onClick={()=>value.handleForcast(city.name)} draggable="true" ondragstart="drag(event)" class="city" key={city.id} id={city.id}>
                <h1>{city.name}, {city.country}</h1> 
                <div class="weather">
                    <h2>{city.date} {city.time}</h2>
                    <div class="temp">
                        <span class="temp1">{city.temp}°{city.unit}</span><br /><span>{city.temp_min}°-{city.temp_max}°{city.unit}</span>
                    </div>
                    <div class="desc">
                        <img src={city.iconurl} /><span>{city.description}</span>
                    </div>
                    <div class="sun">
                        <i class="fas fa-sun"></i><span>{city.sunrise}</span><br />
                        <i class="far fa-moon"></i><span>{city.sunset}</span>
                    </div>
                    <div class="humidity">
                        <i class="fas fa-tint"></i><span> {city.humidity}%</span>
                    </div>
                </div>
                {/* <div class="currExchange">
                    <label for="base_amount">{city.base}</label><br />
                    <input type="number" class="base_amount" value='CAD' />
                    <button type="button" class="enterValue">/</button><br />
                    <label for="target_amount">{city.code}</label><br />
                    {/* <input type="number" class="target_amount" value={city.target_amount.toFixed(3)} disabled /> */}
                {/* </div> */}
                <img src={Close} className='close' alt='close' onClick={()=>value.handleDelete(city.id)}/>
            </div>
            ))}
            </>
            )}
            
        </Consumer>
    )
}