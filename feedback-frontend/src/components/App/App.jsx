import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import CustomRadar from '../Graphs/Radar'
import QuestionBar from '../Graphs/QuestionBar'
import MyLine from '../Graphs/Line';

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
      fetch("http://localhost:9000?rnummer="+rnummer)
        .then(res => res.json())
        .then(res => {
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
                  <a className="waves-effect waves-light btn findbtn" onClick={() => {callServer(document.getElementById("rNummer").value)}}>Submit</a>
                </li>
              </ul>
            </div>
          </nav>
      </div>
      
      <div className='container myContainer'>
        <div className='card-panel row'>
          <div className='col s6' style={{height:300}}>
              <CustomRadar personal={this.state.personal} average={this.state.average} />
          </div>
          <div className='col s6'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5>Jouw profiel in de aanpak van oefeningen mechanica</h5>
                <span className='black-text'>
                  Deze radar plot is een weergave van jouw persoonlijke score op vijf aspecten die belangrijk zijn om de 
                  leerstof volledig te verwerken. Het is een gemiddelde van alle de data over de oefenzittingen heen en 
                  geeft je een overzicht van je sterke en zwakke punten. Jouw score wordt vergeleken met het gemiddelde van 
                  de andere studenten die de reflectiemodule gebruikten. 
                </span>
              </div>
            </div>   
          </div>
        </div>
  
        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5>Evolutie</h5>
                <span className='black-text'>
                  Deze grafiek toont de evolutie van jouw persoonlijke score op de vijf aspecten over de oefenzittingen heen.
                  Elke staaf stelt één aspect, weergegeven in een specifieke kleur. De aspecten zijn gegroepeerd per oefenzitting.
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
                <h5>Plan van aanpak</h5>
                <span className='black-text'>
	    Deze visualisatie toont hoe jouw persoonlijke score op Plan van aanpak evolueerde over de oefenzittingen én hoe die zich vergelijkt ten opzichte van het gemiddelde van de andere studenten die de reflectiemodule invulden.
                </span>
              </div>
            </div>   
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5>Concepten</h5>
                <span className='black-text'>
	    Deze visualisatie toont hoe jouw persoonlijke score op Concepten evolueerde over de oefenzittingen én hoe die zich vergelijkt ten opzichte van het gemiddelde van de andere studenten die de reflectiemodule invulden.
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
                <h5>Wiskundig model</h5>
                <span className='black-text'>
	    Deze visualisatie toont hoe jouw persoonlijke score op Wiskundig model evolueerde over de oefenzittingen én hoe die zich vergelijkt ten opzichte van het gemiddelde van de andere studenten die de reflectiemodule invulden.
                </span>
              </div>
            </div>   
          </div>
        </div>

        <div className='card-panel row'>
          <div className='col s4'>
            <div className='valign-wrapper'>
              <div className='center-align'>
                <h5>Rekentechnische Aanpak</h5>
                <span className='black-text'>
	    Deze visualisatie toont hoe jouw persoonlijke score op Rekentechnische aanpak evolueerde over de oefenzittingen én hoe die zich vergelijkt ten opzichte van het gemiddelde van de andere studenten die de reflectiemodule invulden.
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
                <h5>Fysische interpretatie</h5>
                <span className='black-text'>
	    Deze visualisatie toont hoe jouw persoonlijke score op Fysische interpretatie evolueerde over de oefenzittingen én hoe die zich vergelijkt ten opzichte van het gemiddelde van de andere studenten die de reflectiemodule invulden.
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
