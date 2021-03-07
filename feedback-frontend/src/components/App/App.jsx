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
    const defaultData = [[1,2,3,4,5],[1.3,2.1,2.9,3.8,5],[4,3,2,1,5],[3.8,2.9,2.1,1.3,5],[1,2,3,4,5],[3.8,2.9,2.1,1.3,5]];
    this.state = {personal: defaultData,
    average: defaultData}
  }
  // useEffect(() => {
  //   // take data for r-nummer
  //   console.log("test");
  //   const rnummer = "R_2xS1yjFrKr8h1r9";
  //   // put data in graphs

  //   // profit

  // });

  callServer() {
    fetch("http://localhost:9000/testServer/rnummer")
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({personal: res.personal, average: res.average})})
      .catch(err => err);
  }

  componentDidMount() {
    this.callServer();
  }

  render() {
    const update = () => {
      console.log("test");
      //var data = csv.toObjects("../../../../data-fetching/output/1.csv");
      var data = csv.toObjects("1");
      console.log(data[0]);
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
                  <a className="waves-effect waves-light btn findbtn" onClick={() => {update()}}>button</a>
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
              <QuestionBar />
          </div>
        </div>
  
        <div className='card-panel row'>
          <div className='col s6' style={{height:300}}>
              <MyLine personal={this.state.personal[0]} average={this.state.average[0]} />
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
      </div>
      </>
    );
  }
}

export default App;
