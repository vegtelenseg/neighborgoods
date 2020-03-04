/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInt,
} from 'graphql';
import {globalIdField} from 'graphql-relay';
import {PointInTimeInterface, pointInTimeFields} from './Audit.graphql';

export const ProductAvailabilityEnum = new GraphQLEnumType({
  name: 'ProductAvailabilityEnum',
  values: {
    SOLD: {value: 'SOLD'},
    AVAILABLE: {value: 'AVAILABLE'},
  },
});

export const Product = new GraphQLObjectType({
  name: 'Product',
  interfaces: [PointInTimeInterface],
  fields: () => ({
    id: globalIdField('Product'),
    detail: {
      type: GraphQLNonNull(ProductDetail),
      resolve: (parent) => {
        console.log('DETAIL PARENT: ', parent);
        return parent.activeDetail;
      },
    },
    currentAvailability: {
      type: GraphQLNonNull(ProductAvailability),
      resolve: (parent) => parent.activeAvailability,
    },
    availability: {
      type: GraphQLList(ProductAvailability),
    },
    ...pointInTimeFields,
  }),
});

export const ProductDetail = new GraphQLObjectType({
  name: 'ProductDetail',
  interfaces: [PointInTimeInterface],
  fields: () => ({
    id: globalIdField('ProductDetail'),
    category: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent.category.name,
    },
    price: {
      type: GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    ...pointInTimeFields,
  }),
});

export const ProductAvailability = new GraphQLObjectType({
  name: 'ProductAvailability',
  interfaces: [PointInTimeInterface],
  fields: () => ({
    id: globalIdField('ProductAvailability'),
    availability: {
      type: GraphQLNonNull(ProductAvailabilityEnum),
      resolve: (parent) => parent.sold,
    },
    ...pointInTimeFields,
  }),
});

export const ProductCategory = new GraphQLObjectType({
  name: 'ProductCategory',
  fields: () => ({
    id: globalIdField('ProductCategory'),
    name: {type: GraphQLNonNull(GraphQLString)},
    imageUri: {
      type: GraphQLNonNull(GraphQLString),
    },
    products: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Product))),
    },
  }),
});
