import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline'; // See https://material-ui.com/components/css-baseline/
import DashboardStepped from 'Components/DashboardStepped';

import grey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Route } from "react-router-dom";
import Home from 'Components/Home';
import { parseFeedbackCode } from 'Shared/data';
import Overview from 'Components/Overview';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[100]
    },
    secondary: green,
  }
});

const CodeChild = ({ match }: { match: any }) => {
  const data = parseFeedbackCode(match.params.code)
  if (data) {
    return (
      <DashboardStepped feedbackCodeInfo={data} />
    );
  }
  return <React.Fragment></React.Fragment> // TODO: 404 ?
}

const SessionProgramChild = ({ match }: { match: any}) => {
  return (
    <DashboardStepped feedbackCodeInfo={{program: match.params.program, session: Number(match.params.session)}} />
  );
}

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
        <BrowserRouter>
          <Route path="/:code" component={CodeChild} />
          <Route path="/:session/:program" component={SessionProgramChild} />
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/" component={Home} />
        </BrowserRouter>      
    </React.Fragment>
    </MuiThemeProvider>
  );
}

export default App;
