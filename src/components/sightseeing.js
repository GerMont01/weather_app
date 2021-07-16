import React from "react";
import { Consumer } from "../context";
import './sightseeing.scss';
import parse from 'html-react-parser';
import Close from '../icons/close.svg'


export default function Sightseeing() {
    return(
        <Consumer> 
            {(value) => (
                <div className="sightcontainer">
                    {value.sightseeing.length > 0 ? (
                        <>
                        <img src={Close} className='close' alt='close' onClick={()=>{value.dispatch({type: 'EMPTY_S'}); value.dispatch({type:'TOGGLE_SIGHTSEEING'})}}/>
                        {value.sightseeing.map(sight => (
                            <>
                                <h2>{sight.sight}</h2>
                                <img src={sight.image} alt={sight.sight} height='100px' width='150px'/>
                                {parse(sight.content)}
                            </>
                        ))}
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                       
                </div>
            )}
        </Consumer>
    )
}

