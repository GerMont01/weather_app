import Weather from '../Weather/weather'
import './cities.scss';
import { Consumer } from "../context";
import Forecast from '../Forecast/forecast';

export default function Cities() {
    return (
      <Consumer>
        {(value) => (
            <>
            <div className='container'>
              {value.showForecast ?
                <Forecast />
                :
                <Weather />}
            </div>
            </>
        )}
      </Consumer>
    );
   
}