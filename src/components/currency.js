import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context";
import './currency.scss';


export default function Currency(props) {
    const [city,setCity] = useState(props.city);
    const [base_amount,setBase_amount] = useState(1);
    const data = useContext(Context);

    return(
        <div className="currExchange" key={city.id + 'currency'}>
            <label htmlFor="base_amount">{data.base.toUpperCase()}</label><br/>
            <input type="number" className="base_amount" value={base_amount} onChange={(e)=> setBase_amount(e.target.value)}/>
            <br/>
            <label htmlFor="target_amount">{city.code}</label><br/>
            <input type="number" className="target_amount" value={city.rate * base_amount} onChange={(e)=>setBase_amount(e.target.value/city.rate)}/>
        </div>
    )
}