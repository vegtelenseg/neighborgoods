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
  palette: {
    primary: {
      main: '#002565',
      light: '#21538F',
      dark: '#315086',
    },
    secondary: {
      main: '#63B1E5',
      dark: '#CE0027',
      light: '#fff',
    },
    common: {
      white: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  props: {
    MuiCheckbox: {
      icon: <RadioButtonUncheckedIcon />,
      checkedIcon: <CheckCircleIcon />,
    },
  },
  overrides: {
    MuiTypography: {
      colorSecondary: {
        backgroundColor: '#002565',
        color: '#fff',
      },
    },
    MuiBadge: {
      colorPrimary: {
        backgroundColor: '#B71107',
      },
    },
    MuiSelect: {
      select: {
        '&&:focus': {
          background: 'transparent',
        },
      },
      selectMenu: {
        borderBottom: 'none',
        paddingLeft: '14px',
        display: 'flex',
        alignItems: 'center',
      },
      root: {
        border: 'none !important',
        '&&:hover': {
          border: 'none',
        },
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: 'none',
        background: 'none',
      },
    },
    MuiExpansionPanel: {
      root: {
        border: 'none',
        background: 'transparent',
        boxShadow: 'none',
        '&$expanded': {
          margin: 0,
        },
      },
      rounded: {
        borderRadius: '5rem !important',
        background: 'transparent',
        '&&:before': {
          background: 'inherit',
        },
      },
    },
    MuiStepConnector: {
      line: {
        background: '#002565',
      },
    },
    MuiList: {
      padding: {
        paddingBottom: '16px',
      },
    },
    MuiFab: {
      label: {
        color: '#fff',
      },
    },
    MuiStepper: {
      root: {
        background: 'none',
        // justifyContent: 'space-between',
      },
      // alternativeLabel: {
      //   // flex: 'initial',
      // },
    },

    MuiFormControl: {
      root: {
        paddingTop: '1.1rem',
      },
    },
    MuiSvgIcon: {
      colorAction: {
        color: '#fff',
      },
      colorError: {
        color: '#ff0000',
      },
    },
    MuiButton: {
      root: {
        border: 'none',
        borderRadius: '2rem',
        boxSizing: 'border-box' as 'border-box',
        width: 'fit-content',
        padding: '1.1rem 3.8rem 0.8rem',
        margin: '1.665rem 0',
        minWidth: '0px',
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&$checked': {
          color: '#fff',
        },
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        // marginBottom: '1rem',
        '&$expanded': {
          minHeight: '48px',
        },
      },
      content: {
        margin: 0,
        marginLeft: '-0.7rem',
        marginRight: '0.7rem',
        display: 'grid',
        gridTemplateColumns: '4fr 3fr 5fr',
        textAlign: 'center',
        '&$expanded': {
          margin: 0,
        },
      },
      expandIcon: {
        // border: '2px solid #fff',
        padding: 0,
      },
    },

    MuiExpansionPanelDetails: {
      root: {
        borderRadius: 0,
        padding: 0,
        color: '#001F69',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    },
    MuiContainer: {
      root: {
        padding: '0 8rem',
      },
    },
    MuiInputLabel: {
      root: {
        color: '#fff !important',
        fontSize: '1.25rem',
      },
    },
    MuiInputBase: {
      input: {
        '&:disabled': {
          color: '#fff',
        },
        color: '#fff',
      },
    },
    MuiCollapse: {
      wrapperInner: {
        // '& div': {
        //   display: 'flex',
        //   flexGrow: 1,
        //   // justifyContent: 'space-between',
        //   flexWrap: 'wrap',
        //   padding: 0,
        // },
      },
    },
    MuiStepLabel: {
      alternativeLabel: {
        '&& span': {
          color: '#fff',
        },
      },
    },
    MuiInput: {
      underline: {
        '&&&&:hover:before': {
          borderBottom: 0,
        },
        '&:before': {
          borderBottom: 0,
        },
        '&:after': {
          borderBottom: 0,
        },
      },
      formControl: {
        padding: '6.5px 0',
      },
    },
    MuiCircularProgress: {
      root: {
        width: '25px',
        height: '25px',
      },
    },
    MuiFormLabel: {
      root: {
        color: '#fff',
        'Mui-focused': {
          color: '#fff',
        },
      },
    },
    MuiFormHelperText: {
      root: {
        '&.Mui-error': {
          color: '#ff0000',
          fontSize: '1rem',
        },
      },
    },
    MuiFormControlLabel: {
      labelPlacementStart: {
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '3px',
      },
    },
  },
  spacing: (factor) => `${0.666 * factor}rem`,
  typography: {
    fontFamily: 'anglo-regular, cursive',
    h1: {
      fontFamily: 'anglo-regular',
      color: '#fff',
      fontSize: '5rem',
    },
    h2: {
      fontFamily: 'anglo-light',
      color: '#fff',
      fontSize: '3.5rem',
    },
    h3: {
      fontFamily: 'anglo-light',
      color: '#fff',
      fontSize: '2.55rem',
    },
    h4: {
      fontFamily: 'anglo-light',
      color: '#fff',
      fontSize: '2rem',
    },
    h5: {
      fontFamily: 'anglo-regular',
      color: '#fff',
    },
    h6: {
      fontFamily: 'anglo-regular',
      color: '#fff',
    },
    subtitle1: {
      fontFamily: 'anglo-regular',
      color: '#fff',
    },
    caption: {
      fontFamily: 'anglo-light',
      color: '#fff',
    },
  },
});

export const theme = responsiveFontSizes(baseTheme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
});
