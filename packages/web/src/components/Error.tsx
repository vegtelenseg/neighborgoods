import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
};

interface Props {
  error: Error;
  retry?: () => void;
}

export default function Error({error, retry}: Props) {
  return (
    <div style={styles.container}>
      <Paper style={{padding: 20}}>
        <Typography variant="h6" color="inherit">
          Error: {error.message}
        </Typography>
        {retry && (
          <Button
            style={{margin: 10}}
            color="inherit"
            variant="contained"
            onClick={retry}
          >
            Retry
          </Button>
        )}
      </Paper>
    </div>
  );
}
