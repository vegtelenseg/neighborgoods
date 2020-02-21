import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React from 'react';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    error: {
      color: string;
    };
  }
  interface ThemeOptions {
    error?: {
      color?: string;
    };
  }
}

export const baseTheme = createMuiTheme({
  spacing: (factor) => `${0.5 * factor}rem`,
  overrides: {
    MuiTextField: {
      root: {
        width: '100%',
        margin: '1rem 0',
      },
    },
    MuiIconButton: {
      colorPrimary: {
        color: '#fff',
      },
    },
    MuiOutlinedInput: {
      root: {
        '&$focused $notchedOutline': {
          borderColor: '#fff',
        },
      },
      input: {
        color: '#fff',
        border: 'none',
      },
      notchedOutline: {
        borderColor: '#fff',
        '&$focused': {
          borderColor: 'red ',
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: '#fff',
        '&$focused': {
          color: '#fff',
        },
      },
    },
  },
  typography: {
    fontFamily: 'ngoods-regular, sans-serif',
    h1: {
      fontFamily: 'ngoods-regular, sans-serif',
      color: '#fff',
      fontSize: '5rem',
    },
    h2: {
      fontFamily: 'ngoods-light, sans-serif',
      color: '#fff',
      fontSize: '3.5rem',
    },
    h3: {
      fontFamily: 'ngoods-light, sans-serif',
      color: '#fff',
      fontSize: '2.55rem',
    },
    h4: {
      fontFamily: 'ngoods-light, sans-serif',
      color: '#fff',
      fontSize: '2rem',
    },
    h5: {
      fontFamily: 'ngoods-regular, sans-serif',
      color: '#fff',
    },
    h6: {
      fontFamily: 'ngoods-regular, sans-serif',
      color: '#fff',
    },
    subtitle1: {
      fontFamily: 'ngoods-regular, sans-serif',
      color: '#fff',
    },
    caption: {
      fontFamily: 'ngoods-light, sans-serif',
      color: '#fff',
    },
  },
});

export const theme = responsiveFontSizes(baseTheme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
});
