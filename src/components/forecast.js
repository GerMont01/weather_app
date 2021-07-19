import React from "react";
import { Consumer } from "../context";
import './forecast.scss';

export default function Forecast() {
    const convertTime = (date, offset) => {
        console.log(date,offset)
        let epoch = date + offset;
        let d = new Date(epoch *1000);
        let day = d.getUTCDate();
        let month = d.getUTCMonth() + 1;
        let year = d.getUTCFullYear();
        let h = d.getUTCHours();
        return `${month}/${day}/${year} ${h}:00`
    }
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
                        {value.forecast.data.map((element,index)=>
                            <tr key={index}>
                                <td>{convertTime(element.time, element.timezone)}</td>
                                {(value.unit === 'C') ? (<td>{element.temp}°C</td>):(<td>{(element.temp * 9/5) + 32}°F</td>)}
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
