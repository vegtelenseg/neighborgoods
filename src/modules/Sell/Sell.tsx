import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {Formik, Form} from 'formik';
import Box from '@material-ui/core/Box/Box';

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
  })
);

interface ProductDetails {
  image: any;
  fileName: string;
  fileSize: number;
}

export const Sell = () => {
  const classes = useStyles();
  const [productImage, setProductImage] = React.useState(null as any);
  return (
    <Box className={classes.root}>
      <Formik<ProductDetails>
        onSubmit={(values) => console.log('ON SUBMIT: ', values)}
        initialValues={{image: null as any, fileName: '', fileSize: 0}}
      >
        {(formikProps) => {
          return (
            <>
              <Form>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="icon-button-file"
                  type="file"
                  name="image"
                  onChange={(e) => {
                    e.persist();
                    const hasFiles = (e.target.files &&
                      e.target.files.length > 0) as boolean;
                    const file = hasFiles ? e.target.files![0] : ({} as any);
                    const fileName = file ? file.name : '';
                    const fileSize = file ? file.size : 0;

                    formikProps.setFieldValue(
                      'image',
                      URL.createObjectURL(file)
                    );
                    formikProps.setFieldValue('fileName', fileName);
                    formikProps.setFieldValue('fileSize', fileSize);
                    setProductImage(URL.createObjectURL(file));
                  }}
                />
                <img src={productImage} />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Form>
            </>
          );
        }}
      </Formik>
    </Box>
  );
};
