import React, { useContext, useEffect, useState} from "react";
import { Context } from "../context";
import './city.scss'
import Close from '../icons/close.svg'
import Weather from "./weather";
import Currency from "./currency";
import Refresh from '../icons/refresh.svg';
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { FcCurrencyExchange } from 'react-icons/fc';

export default function City() {
    const data = useContext(Context);
    const [cities,setCities] = useState(data.cities);
    useEffect(()=>{
        setCities(data.cities)
    },[data])
    return(
        <>
            <>
                <div className='changeInfo'>
                    <TiWeatherPartlySunny onClick={()=>data.dispatch({type:'ACTIVE_TAB',payload:'weather'})}/> / <FcCurrencyExchange onClick={()=>data.dispatch({type:'ACTIVE_TAB',payload:'currency'})}/>  
                </div>
                <img className='refresh' alt='' src={Refresh} onClick={()=>window.location.reload()}/>
                <div id='searchbar'>
                    <i className="fas fa-search"></i>
                    <input onKeyDown={(e)=>{if(e.key === 'Enter'){data.handlefetchData(e.target.value); e.target.value=''}}} type="text" id="addCity" placeholder="Add City" autoComplete='off'/>
                </div>
            </>
            {cities.map((city) => (
                <div className="city" key={city.id} id={city.id}>
                    <h1 onClick={()=> data.fetchForcastAndSightseeing(city.name)}>{city.name}, {city.country}</h1>
                    {data.active==='weather'? (
                        <Weather city={city} />
                    ):(
                        <Currency city={city} />
                    )}
                    <img src={Close} className='close' alt='close' onClick={()=>data.dispatch({type:'DELETE', payload:city.id})}/>
                </div>
            
            ))}
        </>
    )
}