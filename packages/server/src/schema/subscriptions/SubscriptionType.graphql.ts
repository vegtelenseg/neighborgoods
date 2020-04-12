import {GraphQLObjectType, GraphQLNonNull, GraphQLResolveInfo} from 'graphql';
import SubscriptionService, {
  SubscriptionEvent,
  PublishNewUserMessagePayload,
} from '../../services/SubscriptionService';
import Context from '../../context';
import {UserMessage} from '../models/UserMessage.graphql';
import UserMessageService from '../../services/UserMessageService';

function subscribe(event: SubscriptionEvent) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parent: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    return SubscriptionService.subscribe(event, parent, args, context, info);
  };
}

const UserMessageUpdate = new GraphQLObjectType({
  name: 'UserNotificationUpdate',
  fields: () => ({
    message: {
      type: GraphQLNonNull(UserMessage),
    },
    // notificationsCount: {
    //   type: GraphQLNonNull(ViewerNotificationsType),
    // },
  }),
});

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    // onSystemUpdated: {
    //   subscribe: subscribe(SubscriptionEvent.),
    //   type: ProductAvailability,
    //   resolve: (_parent) => {
    //     return {};
    //   },
    // },
    onNewUserMessage: {
      subscribe: subscribe(SubscriptionEvent.NEW_MESSAGE),
      type: GraphQLNonNull(UserMessageUpdate),
      resolve: async (parent: PublishNewUserMessagePayload, _, context) => {
        const unread = await UserMessageService.getCurrentUserMessageUnreadCount(
          context
        );

        return {
          notification: parent.message,
          notificationsCount: {
            id: parent.userId,
            unread,
          },
        };
      },
    },
  },
});
