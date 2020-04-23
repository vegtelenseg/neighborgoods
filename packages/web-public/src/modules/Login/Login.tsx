import React from 'react';
import {Link as RouterLink, withRouter, useHistory} from 'react-router-dom';
import {Form, Formik} from 'formik';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {FacebookIcon} from '../../assets/icons/facebook';
import {GoogleIcon} from '../../assets/icons/google';
import * as Yup from 'yup';
import {AuthContext} from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  grid: {
    height: '100%',
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  quote: {
    backgroundColor: theme.palette.primary.main,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  quoteInner: {
    textAlign: 'center' as 'center',
    flexBasis: '600px',
  },
  quoteText: {
    color: theme.palette.common.white,
    fontWeight: 300,
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.common.white,
  },
  bio: {
    color: theme.palette.common.white,
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  logoImage: {
    marginLeft: theme.spacing(4),
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    marginTop: theme.spacing(3),
  },
  socialButtons: {
    marginTop: theme.spacing(3),
  },
  socialIcon: {
    marginRight: theme.spacing(1),
  },
  sugestion: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  signInButton: {
    margin: theme.spacing(2, 0),
  },
}));

interface LoginCredentials {
  email: string;
  password: string;
}

const Schema = Yup.object().shape({
  email: Yup.string().required('Sorry, this field is required'),
  password: Yup.string().required('Sorry, this field is required'),
});

// eslint-disable-next-line
const SignIn = (_props: any) => {
  const history = useHistory();
  const {handleLogin} = React.useContext(AuthContext);

  const classes = useStyles();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container xs={12} sm={12} md={12} lg={12}>
        <Grid
          className={classes.quoteContainer}
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                Hella narwhal Cosby sweater McSweeney&apos;s, salvia kitsch
                before they sold out High Life.
              </Typography>
              <div>
                <Typography className={classes.name} variant="body1">
                  Takamaru Ayako
                </Typography>
                <Typography className={classes.bio} variant="body2">
                  Manager at inVision
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <Formik<LoginCredentials>
                initialValues={{
                  email: 'siya@email.com',
                  password: 'password',
                }}
                validationSchema={Schema}
                onSubmit={async (values, formikHelpers) => {
                  console.log('values: ', values);
                  const response = await handleLogin(
                    values.email,
                    values.password
                  );
                  if (response) {
                    console.log('RESPONSE: ', response);
                    history.push('/');
                  }
                }}
              >
                {(formikProps) => (
                  <Form className={classes.form}>
                    <Typography className={classes.title} variant="h2">
                      Sign in
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Sign in with social media
                    </Typography>
                    <Grid
                      className={classes.socialButtons}
                      container
                      spacing={2}
                    >
                      <Grid item>
                        <Button
                          color="primary"
                          // onClick={handleSignIn}
                          size="large"
                          variant="contained"
                        >
                          <FacebookIcon className={classes.socialIcon} />
                          Login with Facebook
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          // onClick={handleSignIn}
                          size="large"
                          variant="contained"
                        >
                          <GoogleIcon className={classes.socialIcon} />
                          Login with Google
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography
                      align="center"
                      className={classes.sugestion}
                      color="textSecondary"
                      variant="body1"
                    >
                      or login with email address
                    </Typography>
                    <TextField
                      className={classes.textField}
                      error={!!formikProps.errors.email}
                      fullWidth
                      helperText={
                        formikProps.touched.email && formikProps.errors.email
                          ? formikProps.errors.email
                          : null
                      }
                      label="Email address"
                      name="email"
                      onChange={formikProps.handleChange}
                      type="text"
                      // value={formState.values.email || ''}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      error={!!formikProps.errors.email}
                      fullWidth
                      helperText={
                        formikProps.touched.password &&
                        formikProps.errors.password
                          ? formikProps.errors.password
                          : null
                      }
                      label="Password"
                      name="password"
                      onChange={formikProps.handleChange}
                      type="password"
                      // value={formState.values.password || ''}
                      variant="outlined"
                    />
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={!formikProps.isValid}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Sign in now
                    </Button>
                    <Typography color="textSecondary" variant="body1">
                      Don&apos;t have an account?
                      <Link component={RouterLink} to="/sign-up" variant="h6">
                        Sign up
                      </Link>
                    </Typography>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SignIn);
