import {GraphQLObjectType} from 'graphql';
import {User} from './User.graphql';
import {UserService} from '../../services/UserService';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type: User,
      resolve: async (_parent, _args, context) => {
        if (context.user && context.user.id) {
          const user = await UserService.FetchUserById(
            context,
            context.user.id
          );
          return user;
        } else {
          return null;
        }
      },
    },
  }),
});
