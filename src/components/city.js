import React from "react";
import { Consumer } from "../context";
import './city.scss'
import Close from '../icons/close.svg'
import Weather from "./weather";
import Currency from "./currency";

export default function City() {
    return(
        <Consumer>
            {(value) => (
            <>
                {value.cities.map((city) => (
                
                    <div className="city" key={city.id} id={city.id}>
                        <h1 onClick={()=>value.handleSightseeing(city.name)}>{city.name}, {city.country}</h1>
                        {value.active==='weather'? (
                            <Weather city={city} />
                        ):(
                            <Currency city={city} />
                        )}
                        <img src={Close} className='close' alt='close' onClick={()=>value.dispatch({type:'DELETE', payload:city.id})}/>
                    </div>
                
                ))}
            </>
            )}
            
        </Consumer>
    )
}