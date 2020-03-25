import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from 'components/Header/Header';
import Home from 'pages/Home';
import Survey from 'pages/Survey';
import Results from 'pages/Results';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/survey" component={Survey} />
          <Route exact path="/results" component={Results} />
          <Route path="/results/:id" component={Results} />
        </Switch>
      </Fragment>
    );
  }
}
