import React, { useContext, useEffect, useState } from "react";
import './settings.scss';
import { Context } from "../context";
import { RiCloseLine } from 'react-icons/ri';
import { IoSettingsSharp } from 'react-icons/io5'

export default function Settings() {
    const data = useContext(Context);
    const [input, setInput] = useState(data.base);

    useEffect(()=>{
        setInput(data.base);
    },[data.base])
    useEffect(() => {
        if (data.settings) {
            if (data.unit === 'C') {
                document.getElementById('celsius').style.color = 'white';
                document.getElementById('farenheit').style.color = 'black';
            } else {
                document.getElementById('celsius').style.color = 'black';
                document.getElementById('farenheit').style.color = 'white';
            }
        }
    },[data.unit],[data.settings])

    function readURL(){
        var file = document.getElementById("getval").files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
             localStorage.setItem('background',reader.result);
             document.getElementById('body').style.backgroundImage = "url(" + reader.result + ")";        
        }
        if(file){
             reader.readAsDataURL(file);
        }
    }
    return(
        <div className="settings">
            {data.settings ? (
                <>
                <div className="content">
                    <h1>Settings</h1>
                    <label htmlFor="base_input">Base Currency</label>
                    <input id="base_input" type="text" placeholder="Enter Currency" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>
                        {
                            if (e.key === 'Enter'){
                                if (e.target.value.length === 3) { 
                                    data.dispatch({type:"SET_BASE", payload:e.target.value})
                                    
                                }
                                else {
                                    alert('Enter a valid Currency of 3 digits')
                                }
                            }
                        }}/> 
                    <p>Temperature Units: <span id="celsius" onClick={()=>data.dispatch({type: 'SET_UNIT', payload: 'C'})}>C°</span> / <span id="farenheit" onClick={()=>data.dispatch({type: 'SET_UNIT', payload: 'F'})}>F°</span></p>
                    <label htmlFor='getval'>Change Background</label>
                    <input type='file' id='getval' name="background-image" onChange={()=>readURL()}/><br/>
                </div>
                <RiCloseLine className ='closeSettings' onClick={()=>data.dispatch({type:'TOGGLE_SETTINGS', payload:false})}/>
                </>
            ):(
                <IoSettingsSharp className='settingsIcon' onClick={()=>data.dispatch({type:'TOGGLE_SETTINGS', payload:true})}/>
            )}
        </div>
    )
}