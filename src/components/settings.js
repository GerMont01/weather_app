import React, { useContext } from "react";
import './settings.scss';
import { Context } from "../context";
import { RiCloseLine } from 'react-icons/ri'

export default function Settings() {

    const data = useContext(Context);

    return(
        <div id="settings">
            <RiCloseLine className ='closeSettings'/>
            <div class="content">
                <h1>Settings</h1>
                <label for="base_input">Base Currency</label>
                <input id="base_input" type="text" placeholder="Enter Currency" value="CAD" onKeyDown={(e)=>
                    {
                        if (e.key='Enter'){
                            try{
                                data.dispatch({type:"SET_BASE", payload:e.target.value}) 
                            }
                            catch {
                                alert('Enter a valid Currency of 3 digits')
                            }
                        }
                    }}/> 
                <p>Temperature Units: <span id="celsius" onClick={()=>data.dispatch({type: 'SET_UNIT', payload: 'C'})}>C°</span> / <span id="farenheit" onClick={()=>data.dispatch({type: 'SET_UNIT', payload: 'F'})}>F°</span></p>
                <label for='getval'>Change Background</label>
                <input type='file' id='getval' name="background-image" /><br/>
            </div>
        </div>
    )
}