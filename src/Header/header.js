import React, { useEffect, useContext } from "react";
import './header.scss'
import { Consumer } from "../context";
import { Context } from "../context";

export default function Header() {

    const data = useContext(Context);

    useEffect(()=>{
        switch (data.active) {
            case 'weather':
                document.getElementById('W').style.borderBottom = '3px solid white';
                document.getElementById('C').style.borderBottom = 'none';
                document.getElementById('S').style.borderBottom = 'none';
                break;
            case 'currency':
                document.getElementById('C').style.borderBottom = '3px solid white';
                document.getElementById('W').style.borderBottom = 'none';
                document.getElementById('S').style.borderBottom = 'none';
                break;
            case 'sightseeing':
                document.getElementById('S').style.borderBottom = '3px solid white';
                document.getElementById('C').style.borderBottom = 'none';
                document.getElementById('W').style.borderBottom = 'none';
                break;
            default:
                break;
        }
    })
    return (
        <div className='nav'>
            <p id='W' onClick={()=>data.dispatch({ type: 'ACTIVE_TAB', payload: 'weather'})}>Forecast</p>
            <p id='S' onClick={()=>data.dispatch({ type: 'ACTIVE_TAB', payload: 'sightseeing'})}>Sightseeing</p>
            <p id='C' onClick={()=>data.dispatch({ type: 'ACTIVE_TAB', payload: 'currency'})}>Currency</p>
        </div>
    )
}