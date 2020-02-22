import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {Formik, Form} from 'formik';
import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button/Button';
import * as Yup from 'yup';
import {Datepicker} from '../../components/Datepicker';
import {Dropzone} from '../../components/Dropzone';
import {OutlinedTextField} from '../../components/TextField';

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
  images: string[];
  price: string;
  unitNumber: string;
  availableAt: string;
}

const FILE_SIZE = 5000000000;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const Schema = Yup.object().shape({
  images: Yup.mixed()
    .test({
      name: 'fileSize',
      exclusive: true,
      message: 'File Size is too large',
      test: function(value) {
        console.log('CONTEXT VALUES: ', value[0].size);
        return value[0].size <= FILE_SIZE;
      },
    })
    .test('fileType', 'Unsupported File Format', (value) =>
      SUPPORTED_FORMATS.includes(value[0].type)
    ),
  price: Yup.string().required('Please specify the price of the item'),
  unitNumber: Yup.string().required('Please specify your house number'),
  availableAt: Yup.string().required('Please pick a date to make the sale'),
});

export const Sell = () => {
  const classes = useStyles();
  const [images, setSelectedImages] = React.useState([] as any);
  const handleImageSelect = (images: string[]) => {
    setSelectedImages(images);
  };
  return (
    <Box className={classes.root}>
      <Formik<ProductDetails>
        onSubmit={(values) => {
          console.log('ON SUBMIT: ', values);
        }}
        validationSchema={Schema}
        initialValues={{
          images,
          price: '',
          unitNumber: '',
          availableAt: '',
        }}
      >
        {(formikProps) => {
          console.log('ERRORS: ', formikProps.errors);
          return (
            <>
              <Form>
                <Dropzone
                  onChange={handleImageSelect}
                  onDrop={formikProps.setFieldValue}
                  currentImages={images}
                />
                <Box>
                  <OutlinedTextField
                    type="number"
                    label="Price"
                    name="price"
                    placeholder="How much is the item going for?"
                  />
                </Box>
                <Box>
                  <OutlinedTextField
                    label="Unit Number"
                    type="number"
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
