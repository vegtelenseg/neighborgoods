import {withFilter} from 'graphql-subscriptions';
import {GraphQLResolveInfo} from 'graphql';
import * as models from '../models';
import pubSub from '../pubsub';
import Context from '../Context';

export enum SubscriptionEvent {
  NEW_MESSAGE = 'newMessage',
}

class SubscriptionService {
  public static subscribe(
    event: SubscriptionEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parent: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    context: Context,
    info: GraphQLResolveInfo
  ) {
    switch (event) {
      case SubscriptionEvent.NEW_MESSAGE:
        return withFilter(
          () => pubSub.asyncIterator(event),
          (payload) => {
            return payload && context.user
              ? payload.userId == context.user.id
              : false;
          }
        )(parent, args, context, info);
      default:
        throw new Error('Invalid Event.');
    }
  }

  // public static publishSystemUpdate(data: {
  //   onSystemUpdated: models.ProductAvailability;
  // }) {
  //   return pubSub.publish(SubscriptionEvent.SYSTEM_UPDATED, data);
  // }

  public static publishNewUserMessage(data: PublishNewUserMessagePayload) {
    return pubSub.publish(SubscriptionEvent.NEW_MESSAGE, data);
  }
}

export interface PublishNewUserMessagePayload {
  userId: number;
  message: models.UserMessage;
}

export default SubscriptionService;
