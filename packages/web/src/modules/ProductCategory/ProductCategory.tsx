import React from 'react';
import {useFragment} from 'relay-hooks';
import graphql from 'babel-plugin-relay/macro';
import {
  ProductCategory_categories$key,
  ProductCategory_categories,
} from './__generated__/ProductCategory_categories.graphql';
import {Category} from './components/Category';
import {Box} from '@material-ui/core';

interface Props {
  categoriesRef: ProductCategory_categories$key;
}

const PRODUCT_CATEGORY_FRAGMENT = graphql`
  fragment ProductCategory_categories on Viewer {
    productsByCategory {
      name
      # products {
      #   id
      #   detail {
      #     name
      #   }
      #   currentAvailability {
      #     availability
      #   }
      # }
    }
  }
`;

export const ProductCategory = (props: Props) => {
  const {categoriesRef} = props;
  const categories: ProductCategory_categories = useFragment(
    PRODUCT_CATEGORY_FRAGMENT,
    categoriesRef
  );

  return (
    <Box>
      {categories.productsByCategory.map((category) => (
        <Category
          // @ts-ignore
          categoryInfo={category.name}
        />
      ))}
    </Box>
  );
};
