import React, { useState, useEffect, Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import CustomRadar from '../Graphs/Radar'
import QuestionBar from '../Graphs/QuestionBar'
import MyLine from '../Graphs/Line';
import csv from 'jquery-csv';

class App extends Component {
  constructor(props) {
    super(props);
    const defaultPersonalData = [[1.0,0.5714285714285714,0.95,1.0,0.0],
                    [1.0,0.5714285714285714,0.8666666666666667,1.0,0.4],
                    [1.0,0.5714285714285714,0.8666666666666667,0.7946428571428572,0.2],
                    [0.8333333333333334,0.5714285714285714,0.95,1.0,0.6],
                    [1.0,0.5714285714285714,0.7595238095238095,1.0,0.4],
                    [0.8333333333333334,0.5714285714285714,0.8666666666666667,1.0,0.6]];

    const defaultAverageData = [[1.0,0.2857142857142857,0.6928571428571428,0.5357142857142857,0.4],
                    [1.0,0.5714285714285714,0.7952380952380952,1.0,0.8],
                    [0.8333333333333334,0.5714285714285714,0.7785714285714286,0.5446428571428572,0.2],
                    [1.0,0.5714285714285714,0.85,0.9285714285714286,0.2],
                    [1.0,1.0,0.7238095238095238,1.0,0.6],
                    [0.8333333333333334,0.7142857142857143,0.8666666666666667,1.0,0.4]];
    this.state = {personal: defaultPersonalData,
                  average: defaultAverageData};
  }

  render() {
    const callServer = (rnummer) => {
      fetch("http://localhost:9000/testServer/rnummer?rnummer="+rnummer)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          this.setState({personal: res.personal, average: res.average})})
        .catch(err => err);
    }

    
    return (
      <>
      <div className='test'>
        <nav className="grey nav-extended">
            <div className="nav-wrapper">
              <ul className="right hide-on-med-and-down">
                <li className="tab">
                  <form>
                    <div>
                      <div className="input-field col s6">
                        <input placeholder="enter R-nummer hash" id="rNummer" type="text"></input>
                      </div>
                    </div>
                  </form>
                </li>
                <li className="tab">
                  <a className="waves-effect waves-light btn findbtn" onClick={() => {callServer(document.getElementById("rNummer").value)}}>button</a>
                </li>
              </ul>
            </div>
          </nav>
      </div>
      
      <div className='container myContainer'>
        <div className='card-panel row'>
          <div className='col s6' style={{height:300}}>
              <CustomRadar personal={this.state.personal[0]} average={this.state.average[0]} />
          </div>
          <div className='col s6'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
        </div>
  
        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
          <div className='col s8' style={{height:300}}>
              <QuestionBar personal={this.state.personal}/>
          </div>
        </div>
  
        <div className='card-panel row'>
          <div className='col s8' style={{height:300}}>
              <MyLine personal={this.state.personal} average={this.state.average} index={0} />
          </div>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
          <div className='col s8' style={{height:300}}>
              <MyLine personal={this.state.personal} average={this.state.average} index={1} />
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s8' style={{height:300}}>
              <MyLine personal={this.state.personal} average={this.state.average} index={2} />
          </div>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
          <div className='col s8' style={{height:300}}>
              <MyLine personal={this.state.personal} average={this.state.average} index={3} />
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s8' style={{height:300}}>
              <MyLine personal={this.state.personal} average={this.state.average} index={4} />
          </div>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5> Default header</h5>
                <span className='black-text'>
                  mamamljfamdlnvadljhdsfk dsfpj lfsdqf dojvalkfndgaiupem lkvjds afebkzejj dsmfdas sghoqsdfndslm sdqjfqlkfh rabekf sdmjad fazelfhlfnaz mfhazeflnf ajzefmlaznf zmlke
                </span>
              </div>
            </div>   
          </div>
        </div>



      </div>
      </>
    );
  }
}

export default App;
