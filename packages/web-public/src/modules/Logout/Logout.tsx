import React from 'react';

import {AuthContext} from '../../contexts/AuthContext';
import {CircularProgress} from '@material-ui/core';

function Logout() {
  const {handleLogout} = React.useContext(AuthContext);

  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <CircularProgress size={150} />;
}

export default Logout;
