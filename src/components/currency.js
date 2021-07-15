import React from "react";
import { Consumer } from "../context";
import './currency.scss';


export default function Currency(props) {
    const city = props.city;
    return(
        <Consumer>
            {(value) => (
            <>
                <div className="currExchange" key={city.id + 'currency'}>
                    <label htmlFor="base_amount">{value.base}</label><br/>
                    <input type="number" className="base_amount" value={city.base_amount} onChange={(e)=>value.dispatch({type: 'CHANGE_BASE#',payload: {id:city.id,amount:e.target.value} })}/>
                    <br/>
                    <label htmlFor="target_amount">{city.code}</label><br/>
                    <input type="number" className="target_amount" value={(city.rate*city.base_amount).toFixed(3)} disabled/>
                </div>
            </>
            )}
            
        </Consumer>
    )
}