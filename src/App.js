import React from "react";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import Login from './Login';
import Maps from './MainComponent';

function App() {

const NotFoundRedirect = () => <Redirect to='/' />

  return (
    <Router basename={process.env.PUBLIC_URL}>
    	<Switch>
        <Route path={process.env.PUBLIC_URL + '/'} exact component={Login} />
        <Route path="/maps/" component={Maps} /> 
        <Route component={NotFoundRedirect} />  
        </Switch>
    </Router>
  );
}

export default App;