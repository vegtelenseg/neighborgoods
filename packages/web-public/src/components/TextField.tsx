import React from 'react';
import MuiTextField, {
  OutlinedTextFieldProps,
} from '@material-ui/core/TextField/TextField';
import {useField} from 'formik';
export function OutlinedTextField({
  name,
  ...props
}: Omit<OutlinedTextFieldProps, 'name' | 'value' | 'variant'> & {
  name: string;
}) {
  const [field, meta] = useField(name);

  return (
    <MuiTextField
      variant="outlined"
      {...field}
      error={!!(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : null}
      {...props}
    />
  );
}
