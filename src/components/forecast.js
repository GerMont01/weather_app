import React from "react";
import { Consumer } from "../context";
import './forecast.scss';

export default function Forecast() {
    return(
        <Consumer> 
            
            {(value) => (
            <>
            <div key='forecast' className='forecastContainer'>
                <h1>{value.forecast.name}, {value.forecast.country}</h1>
                <table id="table">
                    <thead>
                        <tr><td>Time</td><td>Temperature</td><td>Description</td><td>Humidity</td></tr>
                    </thead>
                    <tbody>
                        {value.forecast.data.map((element)=>
                            <tr>
                                <td>{element.time}</td>
                                <td>{element.temp}°C</td>
                                <td><img src={element.iconurl} height='50px' alt='icon'/><span>{element.description}</span></td>
                                <td><i className="fas fa-tint"></i><span>{element.humidity}%</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </>
            )}
        </Consumer>
    )
}
