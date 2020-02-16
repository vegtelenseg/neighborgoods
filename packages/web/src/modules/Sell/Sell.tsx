import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {Formik, Form} from 'formik';
import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button/Button';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField/TextField';
import { Datepicker } from '../../components/Datepicker';

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
    imagePreview: {
      display: 'flex',
      justifyContent: 'center',
      background: theme.palette.common.black,
    },
    textField: {
      color: theme.palette.common.black,

      '& input': {
        paddingBottom: 0,
      },
      '& input:focus': {
        opacity: 1,
      },
    },
  })
);

interface ProductDetails {
  image: File;
  price: string;
  unitNumber: string;
  eta: string;
}

const Schema = Yup.object().shape({
  image: Yup.string().required(
    'Sorry. You have have to upload at least one image'
  ),
  price: Yup.string().required('Please specify the price of the item'),
  unitNumber: Yup.string().required('Please specify your house number'),
  eta: Yup.string().required('Please pick a date to make the sale')
});
export const Sell = () => {
  const classes = useStyles();
  const [productImage, setProductImage] = React.useState(null as any);
  return (
    <Box className={classes.root}>
      <Formik<ProductDetails>
        onSubmit={(values) => {
          console.log('ON SUBMIT: ', values)
          
        }}
        validationSchema={Schema}
        initialValues={{image: null as any, price: '', unitNumber: '', eta: ''}}
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
                    const hasFiles = (e.target.files &&
                      e.target.files.length > 0);
                    const file = hasFiles && e.target.files![0];
                    setProductImage(URL.createObjectURL(file));
                    formikProps.setFieldValue('image', file);
                  }}
                />
                <Box className={classes.imagePreview}>
                  <img src={productImage} />
                </Box>
                <Box>
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
                  <TextField onChange={formikProps.handleChange} variant="outlined" name="price" placeholder="How much is the item going for?"/>
                </Box>
                <Box>
                  <TextField onChange={formikProps.handleChange} label="Unit Number" variant="outlined" name="unitNumber" placeholder="What is your unit number?"/>
                </Box>
                <Box>
                  <Datepicker setFieldValue={formikProps.setFieldValue} className={classes.textField} />
                </Box>
                <Box>
                  <Button
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
