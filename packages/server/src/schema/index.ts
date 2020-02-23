import {GraphQLNonNull, GraphQLObjectType, GraphQLSchema} from 'graphql';

import Viewer from './models/Viewer.graphql';
import {nodeField} from './Relay';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: new GraphQLNonNull(Viewer),
      resolve: () => ({}),
    },
  }),
});

export default new GraphQLSchema({
  query,
});
