import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import {User} from './User.graphql';
import {UserService} from '../../services/UserService';
import {Product as ProductType, ProductCategory} from './Product.graphql';
import {ProductService} from '../../services/ProductService';
import {Product} from '../../models';

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
    products: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductType))),
      resolve: async (_parent, _args, context) => {
        const systems = await Product.query()
          .eager(
            '[detail(active).[category], statuses(active), availability(active)]'
          )
          .context(context);
        return systems;
      },
    },
    productsByCategory: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductCategory))),
      args: {
        linkedToUser: {
          type: GraphQLBoolean,
        },
      },
      resolve: async (_parent, args, context) => {
        const {linkedToUser} = args;
        if (linkedToUser !== null) {
          return await ProductService.fetchProductsByCategory(
            context,
            linkedToUser
          );
        }
        return await ProductService.fetchProductsByCategory(context);
      },
    },
  }),
});
