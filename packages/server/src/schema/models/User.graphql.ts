import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import {globalIdField} from 'graphql-relay';
import {Product} from './Product.graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLNonNull(GraphQLString),
    },
    profile: {
      type: UserProfile,
      resolve: async (parent) => parent.activeProfile,
    },
    userProducts: {
      type: new GraphQLList(UserProduct),
    },
  }),
});

export const UserProduct = new GraphQLObjectType({
  name: 'UserProduct',
  fields: () => ({
    id: globalIdField('UserProduct'),
    product: {
      type: GraphQLNonNull(Product),
      resolve: (parent) => parent.product,
    },
  }),
});

export const UserProfile = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    profileName: {
      type: GraphQLNonNull(GraphQLString),
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    unitNumber: {
      type: GraphQLInt,
    },
    cellphone: {
      type: GraphQLString,
    },
  }),
});
