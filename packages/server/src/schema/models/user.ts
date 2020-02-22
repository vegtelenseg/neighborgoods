import {GraphQLObjectType, GraphQLNonNull, GraphQLString} from 'graphql';
import {globalIdField} from 'graphql-relay';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
});
