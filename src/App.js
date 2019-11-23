import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './Login';
import Maps from './MainComponent';

function App() {
  return (
    <Router>
        <Route path="/" exact component={Login} />
        <Route path="/maps/" component={Maps} />   
    </Router>
  );
}

export default App;