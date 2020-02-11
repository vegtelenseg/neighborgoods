import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './modules/Login/Login';
import {MuiThemeProvider} from '@material-ui/core';
import theme from './theme/index';
import {Navigation} from './modules/Navigation/Navigation';
import {Home} from './modules/Home/Home';
import {Cart} from './modules/Cart/Cart';
import {Sell} from './modules/Sell/Sell';
import {Profile} from './modules/Profile/Profile';

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path={['/buy', '/', '/home']} exact>
            <Home />
          </Route>
          <Route path="/sell">
            <Sell />
          </Route>
          <Route path="/cart" exact>
            <Cart />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
        <Navigation />
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
