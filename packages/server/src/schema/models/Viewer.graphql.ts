import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import {User} from './User.graphql';
import {UserService} from '../../services/UserService';
import {Product as ProductType, ProductCategory} from './Product.graphql';
import {ProductService} from '../../services/ProductService';
import {Product} from '../../models';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  cursorToOffset,
  connectionFromArraySlice,
  globalIdField,
} from 'graphql-relay';
import {UserMessage} from './UserMessage.graphql';
import UserMessageService from '../../services/UserMessageService';
import {nodeInterface} from '../Relay';

const {connectionType: ViewerMessageConnection} = connectionDefinitions({
  name: 'ViewerMessages',
  nodeType: UserMessage,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt),
    },
  },
});

export const ViewerMessagesType = new GraphQLObjectType({
  name: 'ViewerMessageCount',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField('ViewerMessageCount'),
    unread: {
      type: GraphQLNonNull(GraphQLInt),
    },
    deleted: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
  }),
});

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type: User,
      resolve: async (_parent, _args, {context, req}) => {
        console.log('RESOLVER CONTEXT: ', req);
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
    messages: {
      type: ViewerMessageConnection,
      args: {
        ...forwardConnectionArgs,
        read: {
          type: GraphQLBoolean,
        },
      },
      resolve: async (_parent, args, context) => {
        if (!context.user) {
          return null;
        }

        const {first, after, read} = args;
        const offset = after ? cursorToOffset(after) + 1 : 0;

        const {
          results,
          total,
        } = await UserMessageService.getCurrentUserNotifications(context, {
          read,
          limit: first,
          offset,
          deleted: false,
        });

        return {
          total,
          ...connectionFromArraySlice(results, args, {
            sliceStart: offset,
            arrayLength: total,
          }),
        };
      },
    },
    products: {
      type: GraphQLList(GraphQLNonNull(ProductType)),
      resolve: async (_parent, _args, context) => {
        if (!context.user) {
          return null;
        }
        const systems = await Product.query()
          .eager(
            '[detail(active).[category], statuses(active), availability(active)]'
          )
          .context(context);
        return systems;
      },
    },
    productsByCategory: {
      type: GraphQLList(GraphQLNonNull(ProductCategory)),
      args: {
        linkedToUser: {
          type: GraphQLBoolean,
        },
      },
      resolve: async (_parent, args, context) => {
        if (!context.user) {
          return null;
        }
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
