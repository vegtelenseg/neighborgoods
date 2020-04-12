import React from 'react';
import {RelayRenderer} from '../../components/RelayRenderer';
import graphql from 'babel-plugin-relay/macro';

import {HomeQuery, HomeQueryResponse} from './__generated__/HomeQuery.graphql';
import {ProductCategories} from '../ProductCategories/ProductCategories';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
// }));

interface Props {
  data: HomeQueryResponse;
}

const HOME_QUERY = graphql`
  query HomeQuery {
    viewer {
      ...ProductCategories_categories
    }
  }
`;

const Home = (props: Props) => {
  const {data: viewer} = props;
  // const classes = useStyles();
  return <ProductCategories categoriesRef={viewer.viewer} />;
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
