import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {Formik, Form} from 'formik';
import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button/Button';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField/TextField';
import {Datepicker} from '../../components/Datepicker';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
    button: {
      margin: theme.spacing(2, 0),
      width: '100%',
    },
    imagePreview: {
      display: 'flex',
      justifyContent: 'center',
      background: theme.palette.common.black,
      height: '35vh',
      '& img': {
        width: '100%',
      },
    },
    textField: {
      color: theme.palette.common.black,
    },
    cameraIcon: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(1.1),
    },
  })
);

interface ProductDetails {
  image: File;
  price: string;
  unitNumber: string;
  availableAt: string;
}

const Schema = Yup.object().shape({
  image: Yup.string().required(
    'Sorry. You have have to upload at least one image'
  ),
  price: Yup.string().required('Please specify the price of the item'),
  unitNumber: Yup.string().required('Please specify your house number'),
  availableAt: Yup.string().required('Please pick a date to make the sale'),
});
export const Sell = () => {
  const classes = useStyles();
  const [productImage, setProductImage] = React.useState(null as any);
  return (
    <Box className={classes.root}>
      <Formik<ProductDetails>
        onSubmit={(values) => {
          console.log('ON SUBMIT: ', values);
        }}
        validationSchema={Schema}
        initialValues={{
          image: null as any,
          price: '',
          unitNumber: '',
          availableAt: '',
        }}
      >
        {(formikProps) => {
          return (
            <>
              <Form>
                <input
                  name="image"
                  className={classes.input}
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => {
                    e.persist();
                    const hasFiles =
                      e.target.files && e.target.files.length > 0;
                    const file = hasFiles && e.target.files![0];
                    setProductImage(URL.createObjectURL(file));
                    formikProps.setFieldValue('image', file);
                  }}
                />
                <Box className={classes.imagePreview}>
                  <img src={productImage} />
                </Box>
                <Box className={classes.cameraIcon}>
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>
                <Box>
                  <TextField
                    onChange={formikProps.handleChange}
                    variant="outlined"
                    label="Price"
                    name="price"
                    placeholder="How much is the item going for?"
                  />
                </Box>
                <Box>
                  <TextField
                    onChange={formikProps.handleChange}
                    label="Unit Number"
                    variant="outlined"
                    name="unitNumber"
                    placeholder="What is your unit number?"
                  />
                </Box>
                <Box>
                  <Datepicker
                    setFieldValue={formikProps.setFieldValue}
                    className={classes.textField}
                    name="availableAt"
                  />
                </Box>
                <Box>
                  <Button
                    className={classes.button}
                    type="submit"
                    disabled={
                      !formikProps.isValid ||
                      !formikProps.dirty ||
                      formikProps.isSubmitting
                    }
                    variant="contained"
                    color="primary"
                  >
                    Upload
                  </Button>
                </Box>
              </Form>
            </>
          );
        }}
      </Formik>
    </Box>
  );
};
