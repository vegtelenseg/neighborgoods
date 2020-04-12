import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {RelayRenderer} from '../../components/RelayRenderer';
import {ProductsQuery} from './__generated__/ProductsQuery.graphql';
import {useParams} from 'react-router';
import {ProductsQueryResponse} from './__generated__/ProductsQuery.graphql';
import {makeStyles, Theme, createStyles, Box} from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import Product from '../../components/Product';
import Error from '../../components/Error';
import Typography from '@material-ui/core/Typography';
import socketIOClient from 'socket.io-client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);
interface Props {
  data: ProductsQueryResponse;
}

const PRODUCT_QUERY = graphql`
  query ProductsQuery($id: ID!) {
    node(id: $id) {
      ... on ProductCategory {
        name
        products {
          id
          detail {
            name
            description
            price
          }
          currentAvailability {
            availability
          }
        }
      }
    }
  }
`;
export const Products = (props: Props) => {
  const classes = useStyles();

  React.useEffect(() => {
    const socket = socketIOClient('http://localhost:5000', {});
    socket.on('message', (data: any) => console.log('DATA: ', data));
  });
  const {data} = props;
  const {node} = data;
  if (node && node.products) {
    const {products} = node;
    return (
      <Box m={2}>
        <Box mb={2}>
          <Typography variant="h4">{node.name}</Typography>
        </Box>
        {products.map((product) => {
          return (
            <Product
              product={{
                description: product.detail.description as string,
                name: product.detail.name,
                price: product.detail.price,
                imageUri: 'https://via.placeholder.com/150',
              }}
            />
          );
        })}
      </Box>
    );
  }
  return (
    <Error
      error={{
        name: 'Retrieve Products',
        message: 'Could not resolve Products',
      }}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductsContainer(props: any) {
  const params = useParams();
  return (
    <RelayRenderer<ProductsQuery>
      query={PRODUCT_QUERY}
      variables={{
        // @ts-ignore
        id: params.id,
      }}
    >
      {(data) => {
        return <Products {...props} data={data} />;
      }}
    </RelayRenderer>
  );
}
