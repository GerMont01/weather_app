import City from './city';
import './cities.scss';
import { Consumer } from "../context";
import Forecast from './forecast';
import Sightseeing from './sightseeing';
import Nav from './nav';
import Close from '../icons/close.svg';

export default function Cities() {
    return (
      <Consumer>
        {(value) => (
            <>
            <div className='container'>
              {value.showForecast ? (
                <Forecast />
              ):value.showSightseeing ? (
                <Sightseeing />
              ):(
                <City />
              )}
            </div>
            {value.showForecast || value.showSightseeing ? (
              <>
                <img src={Close} className='closeFS' alt='close' onClick={()=>{
                  value.dispatch({type: 'EMPTY_S'}); 
                  value.dispatch({type:'TOGGLE_SIGHTSEEING', payload: false});
                  value.dispatch({type:'TOGGLE_FORECAST', payload: false})
                  }}/>
                <Nav/>
              </>
            ) : (
              <></>
            )}
            </>
        )}
      </Consumer>
    );
   
}