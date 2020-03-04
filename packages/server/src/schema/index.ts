import {GraphQLNonNull, GraphQLObjectType, GraphQLSchema} from 'graphql';

import Viewer from './models/Viewer.graphql';
import {nodeField} from './Relay';
// import Mutations from './mutations';

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

// const mutation = new GraphQLObjectType({
//   name: 'Mutations',
//   fields: Mutations,
// });

export default new GraphQLSchema({
  query,
  // mutation,
});
