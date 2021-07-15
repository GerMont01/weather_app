import React from "react";
import { Consumer } from "../context";
import './sightseeing.scss';
import parse from 'html-react-parser';


export default function Sightseeing() {
    return(
        <Consumer> 
            {(value) => (
                <div className="sightcontainer">
                    {value.sightseeing.length > 0 ? (
                        value.sightseeing.map(sight => (
                            <>
                                <h2>{sight.sight}</h2>
                                <img src={sight.image} alt={sight.sight} height='100px' width='150px'/>
                                {parse(sight.content)}
                            </>
                    ))) : (
                        <p>Loading...</p>
                    )}
                       
                </div>
            )}
        </Consumer>
    )
}

