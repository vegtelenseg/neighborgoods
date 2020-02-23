import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './modules/Login/Login';
import {MuiThemeProvider, Container} from '@material-ui/core';
import {theme} from './Theme';
import {Navigation} from './modules/Navigation/Navigation';
import Home from './modules/Home/Home';
import {Cart} from './modules/Cart/Cart';
import {Sell} from './modules/Sell/Sell';
import {Profile} from './modules/Profile/Profile';
import {RelayEnvironmentProvider} from 'relay-hooks';
import createRelayEnv from './CreateRelayEnv';
import {useAuthContextProvider} from './contexts/AuthContext';
import {Environment} from 'react-relay';
import _ from 'lodash';

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
          return Promise.resolve(auth.token);
        } else {
          return Promise.resolve('');
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
    <MuiThemeProvider theme={theme}>
      <Container>
        <RelayEnvironmentProvider environment={environment}>
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
        </RelayEnvironmentProvider>
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
