import City from './city';
import Currency from './currency';
import './cities.scss';
import { Consumer } from "../context";
import Forecast from './forecast';
import Sightseeing from './sightseeing';

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
            </>
        )}
      </Consumer>
    );
   
}