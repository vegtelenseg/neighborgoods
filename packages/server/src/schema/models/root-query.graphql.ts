import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    oneField: {
      type: GraphQLString
    }
  })
})
