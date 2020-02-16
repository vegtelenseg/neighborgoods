import {GraphQLNonNull, GraphQLObjectType, GraphQLSchema} from 'graphql';

import RootQuery from './models/root-query.graphql';
import {nodeField} from './Relay';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: new GraphQLNonNull(RootQuery),
      resolve: () => ({}),
    },
  }),
});

export default new GraphQLSchema({
  query,
});
