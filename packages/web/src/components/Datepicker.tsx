import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  setFieldValue: (field: string, value: Date) => void;
  className: string;
}
export const Datepicker = (props: Props) => {
  const [date, setDate] = React.useState(new Date());
  return (
    <DatePicker
      name="eta"
      placeholderText="Select availability"
      onChange={(e: Date) => {
        setDate(e);
        props.setFieldValue('eta', e as Date);
      }}
      selected={date}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm aa"
      className={props.className}
    />
  );
};
