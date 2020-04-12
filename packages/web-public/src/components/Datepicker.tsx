import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';
import Box from '@material-ui/core/Box/Box';
import moment from 'moment';

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
  const timeNow = moment();
  const maxTime = timeNow.clone();
  const hoursLapsed = timeNow.get('hours');
  const minutesLapsed = timeNow.get('minutes');
  const hoursRemaining = 23 - hoursLapsed;
  const minutesRemaining = 59 - minutesLapsed;
  maxTime.add(hoursRemaining, 'hours').add(minutesRemaining, 'minutes');
  const isAfterToday = moment(date).isAfter(timeNow.toDate());
  // Reset time interval if future day is selected
  if (isAfterToday) {
    maxTime.add(1, 'hour').add(1, 'minute');
  }
  return (
    <Box className={classes.root}>
      <DatePicker
        name={props.name}
        placeholderText="When are you available to show/sell"
        onChange={(e: Date) => {
          setDate(e);
          props.setFieldValue(props.name, e as Date);
        }}
        selected={date}
        showTimeSelect
        minDate={timeNow.toDate()}
        minTime={timeNow.toDate()}
        maxTime={maxTime.toDate()}
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="d MMMM, h:mm aa"
        className={`${classes.root} MuiInputBase-input MuiOutlinedInput-input`}
      />
    </Box>
  );
};
