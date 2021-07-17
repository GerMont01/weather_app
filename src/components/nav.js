import React, { useEffect, useContext } from "react";
import './nav.scss'
import { Context } from "../context";

export default function Nav() {

    const data = useContext(Context);

    useEffect(()=>{
        if (data.showForecast === true) {
            document.getElementById('F').style.borderBottom = '3px solid white';
            document.getElementById('S').style.borderBottom = 'none';
        }
        if (data.showSightseeing === true) {       
            document.getElementById('S').style.borderBottom = '3px solid white';
            document.getElementById('F').style.borderBottom = 'none';
        }
    },[data.showForecast],[data.showSightseeing]);
    return (
        <div className='nav'>
            <p id='F' onClick={()=>{
                data.dispatch({ type: 'TOGGLE_FORECAST', payload: true});
                data.dispatch({ type: 'TOGGLE_SIGHTSEEING', payload: false});
            }}>Forecast</p>
            <p id='S' onClick={()=>{
                data.dispatch({ type: 'TOGGLE_SIGHTSEEING', payload: true});
                data.dispatch({ type: 'TOGGLE_FORECAST', payload: false});
            }}>Sightseeing</p>
        </div>
    )
}