import React from 'react';
import {RelayRenderer} from '../../components/RelayRenderer';
import graphql from 'babel-plugin-relay/macro';

import {HomeQuery, HomeQueryResponse} from './__generated__/HomeQuery.graphql';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import {ProductCategory} from '../ProductCategory/ProductCategory';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '6fr 6fr',
  },
}));

interface Props {
  data: HomeQueryResponse;
}

const HOME_QUERY = graphql`
  query HomeQuery {
    viewer {
      ...ProductCategory_categories
    }
  }
`;

const Home = (props: Props) => {
  console.log('data: ', props.data);
  const {data: viewer} = props;
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {<ProductCategory categoriesRef={viewer.viewer} />}
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomeContainer(props: any) {
  return (
    <RelayRenderer<HomeQuery> query={HOME_QUERY} variables={{}}>
      {(data) => {
        return <Home {...props} data={data} />;
      }}
    </RelayRenderer>
  );
}
