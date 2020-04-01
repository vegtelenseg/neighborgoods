import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './modules/Login/Login';
import {MuiThemeProvider} from '@material-ui/core';
import {theme} from './Theme';
import {Navigation} from './modules/Navigation/Navigation';
import Home from './modules/Home/Home';
import {Cart} from './modules/Cart/Cart';
import {Sell} from './modules/Sell/Sell';
import {Profile} from './modules/Profile/Profile';
import {RelayEnvironmentProvider} from 'relay-hooks';
import createRelayEnv from './CreateRelayEnv';
import AuthContextProvider, {
  useAuthContextProvider,
} from './contexts/AuthContext';
import {Environment} from 'react-relay';
import _ from 'lodash';
import Menu from './modules/Menu/Menu';
import {Products} from './modules/Products/Products';

const App = () => {
  const {auth, handleLogout} = useAuthContextProvider();
  const authRef = React.useRef(auth);

  const createEnvironment: () => Environment = React.useCallback(() => {
    return createRelayEnv(
      () => {
        handleLogout();
      },
      () => {
        if (auth.authenticated) {
          return {
            accessToken: auth.token,
            refreshToken: auth.refreshToken
          };
        } else {
          return {
            accessToken: '',
            refreshToken: ''
          };
        }
      }
    );
  }, [auth, handleLogout]);

  const [environment, setEnvironment] = React.useState(createEnvironment());

  React.useEffect(() => {
    if (!_.isEqual(authRef.current, auth) && environment) {
      setEnvironment(createEnvironment());
    }

    authRef.current = auth;
  }, [auth, createEnvironment, environment]);
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Router>
        <Menu />
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
          <Route path="/products">
            <Products />
          </Route>
        </Switch>
        <Navigation />
      </Router>
    </RelayEnvironmentProvider>
  );
};

export const AuthApp = () => (
  <MuiThemeProvider theme={theme}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </MuiThemeProvider>
);
