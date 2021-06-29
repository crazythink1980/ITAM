import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Index from './pages/Index';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/' component={Index} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
