import {GraphQLObjectType} from 'graphql';
import {User} from './user';
import {UserService} from '../../services/UserService';
import Context from '../../context';

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: {
      type: User,
      resolve: async (_parent, _args, context: Context, info) => {
        console.log('CONTEXT: ', info);
        //if the user object does not have an id, then the user does not exist in our db.
        const user = await UserService.FetchUserById(context, 2);
        return user;
      },
    },
  }),
});
