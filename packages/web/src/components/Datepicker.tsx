import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';
import Box from '@material-ui/core/Box/Box';

const useStyles = makeStyles((_theme) => ({
  root: {
    '& .react-datepicker-wrapper': {
      width: '100%',
    },
  },
}));
interface Props {
  setFieldValue: (field: string, value: Date) => void;
  className: string;
  name: string;
}
export const Datepicker = (props: Props) => {
  const [date, setDate] = React.useState(null as any);
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <DatePicker
        name={props.name}
        placeholderText="When are you available to show/sell"
        onChange={(e: Date) => {
          setDate(e);
          props.setFieldValue(props.name, e as Date);
        }}
        selected={null || date}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa"
        className={`${classes.root} MuiInputBase-input MuiOutlinedInput-input`}
      />
    </Box>
  );
};
