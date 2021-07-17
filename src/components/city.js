import React from "react";
import { Consumer } from "../context";
import './city.scss'
import Close from '../icons/close.svg'
import Weather from "./weather";
import Currency from "./currency";
import Refresh from '../icons/refresh.svg';
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { FcCurrencyExchange } from 'react-icons/fc';

export default function City() {
    return(
        <Consumer>
            {(value) => (
            <>
                <>
                    <div className='changeInfo'>
                      <TiWeatherPartlySunny onClick={()=>value.dispatch({type:'ACTIVE_TAB',payload:'weather'})}/> / <FcCurrencyExchange onClick={()=>value.dispatch({type:'ACTIVE_TAB',payload:'currency'})}/>  
                    </div>
                    <img className='refresh' alt='' src={Refresh} onClick={()=>window.location.reload()}/>
                    <div id='searchbar'>
                        <i className="fas fa-search"></i>
                        <input onKeyDown={(e)=>{if(e.key === 'Enter'){value.handlefetchData(e.target.value); e.target.value=''}}} type="text" id="addCity" placeholder="Add City" autoComplete='off'/>
                    </div>
                </>
                {value.cities.map((city) => (
                
                    <div className="city" key={city.id} id={city.id}>
                        <h1 onClick={()=> value.fetchForcastAndSightseeing(city.name)}>{city.name}, {city.country}</h1>
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