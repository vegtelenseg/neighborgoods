import React from 'react';
import Product from '../../components/Product';

export const Products = () => {
  return (
    <div>
      {Array(10)
        .fill(null)
        .map((item) => {
          return <Product />;
        })}
    </div>
  );
};
