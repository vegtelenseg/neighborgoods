import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {useHistory} from 'react-router';
import CartIcon from '@material-ui/icons/AddShoppingCartOutlined';
import StoreIcon from '@material-ui/icons/Store';
import PaymentIcon from '@material-ui/icons/Payment';
import ActionAccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

export const Navigation = () => {
  const classes = useStyles();
  const fullPath = window.location.pathname;
  const path = fullPath.split('/')[1];
  const [value, setValue] = React.useState(path || 'recents');
  const history = useHistory();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    history.push(`/${newValue}`);
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root}
    >
      <BottomNavigationAction label="Buy" value="buy" icon={<PaymentIcon />} />
      <BottomNavigationAction label="Sell" value="sell" icon={<StoreIcon />} />
      <BottomNavigationAction label="Cart" value="cart" icon={<CartIcon />} />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<ActionAccountCircleOutlined />}
      />
    </BottomNavigation>
  );
};
