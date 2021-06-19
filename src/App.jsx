import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Homepage from './pages/Homepage';
import Login from './pages/Login';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={Homepage} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
