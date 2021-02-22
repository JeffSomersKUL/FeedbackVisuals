import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import CustomRadar from '../Graphs/Radar'
import QuestionBar from '../Graphs/QuestionBar'
import BmiForm from '../BmiForm/BmiForm';
import Info from '../Info/Info';
import Bar from '../Bar/Bar';
import { ResponsiveRadar } from '@nivo/radar';
import { getData, storeData } from '../../helpers/localStorage';

const App = () => {
  const data = [[1,2,3,4],[1.3,2.1,2.9,3.8],[4,3,2,1],[3.8,2.9,2.1,1.3],[1,2,3,4],[3.8,2.9,2.1,1.3]]
  const RadarPersonal = [54,94,65,72,66];
  const RadarAverage = [60,72,45,80,72];
  const [personalState, setPersonalState] = useState([1,2,3,4]);
  const [totalState, setTotalState] = useState([1.3,2.1,2.9,3.8]);
  const [option, setOption] = useState(1);

  useEffect(() => {
    //
    // switch data sets for different graphs
    //
    setPersonalState(data[2*option])
    setTotalState(data[2*option+1])
    //
    // switch between different graphs
    //


    // storeData('data', state);
    // const date = state.map(obj => obj.date);
    // const bmi = state.map(obj => obj.bmi);
    // let newData = { date, bmi };
    // setOption(newData);
  }, [option]);

  const handleChange = val => {
    let heightInM = val.height / 100;
    val.bmi = (val.weight / (heightInM * heightInM)).toFixed(2);
    val.id = uuidv4();
    let newVal = [...personalState, val];
    let len = newVal.length;
    if (len > 7) newVal = newVal.slice(1, len);
    setPersonalState(newVal);
  };

  const handleDelete = id => {
    storeData('lastState', personalState);
    let newState = personalState.filter(i => {
      return i.id !== id;
    });
    setPersonalState(newState);
  };

  const handleOptionChange = (newOption) => {
    setOption(newOption);
  }

  return (
    <>
    <div className='test'>
      <nav className="blue nav-extended">
          <div className="nav-content">
            <ul className="tabs tabs-transparent">
              <li className="tab"><a onClick={() => handleOptionChange(0)}>Grafiek 1</a></li>
              <li className="tab"><a onClick={() => handleOptionChange(1)}>Grafiek 2</a></li>
              <li className="tab"><a onClick={() => handleOptionChange(2)}>Grafiek 3</a></li>
            </ul>
          </div>
        </nav>
    </div>
    <div className='container' > 
      <div className='row'>
        <div className='col m12 s12' style={{height:300}}>
            <CustomRadar personal={RadarPersonal} average={RadarAverage} />
        </div>
        <div className='col m12 s12' style={{height:300}}>
            <QuestionBar />
        </div>
        <div className='col m12 s12'>
          <Bar labelData={personalState} bmiData={personalState} totalData={totalState} />
        </div>
      </div>
    </div>
    </>
  );
};

export default App;
