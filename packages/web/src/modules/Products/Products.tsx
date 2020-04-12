import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {RelayRenderer} from '../../components/RelayRenderer';
import {ProductsQuery} from './__generated__/ProductsQuery.graphql';
import {useParams} from 'react-router';
import {ProductsQueryResponse} from './__generated__/ProductsQuery.graphql';
interface Props {
  data: ProductsQueryResponse;
}

const PRODUCT_QUERY = graphql`
  query ProductsQuery($id: ID!) {
    node(id: $id) {
      ... on ProductCategory {
        products {
          id
          detail {
            name
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
  const {data} = props;
  const {node} = data;
  if (node && node.products) {
    const {products} = node;
    return (
      <>
        {products.map((product) => {
          return <div>{product.detail.name}</div>;
        })}
      </>
    );
  }
  return <div>Error Resolving Products</div>;
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
