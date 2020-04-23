import {transaction} from 'objection';
import Context from '../Context';
import * as models from '../models';
// import {NotificationCategories} from '../models';
import SubscriptionService from './SubscriptionService';
// import {addActiveStatusFields} from './helpers';

interface Connection<T> {
  results: T[];
  total: number;
}

// type LinkType = 'EXTERNAL' | 'INTERNAL';
export interface UserNotificationCreateOptions {
  userId: number;
  // title: string;
  message: string;
  createdAt?: string;
}

class UserMessageService {
  public static async getCurrentUserNotifications(
    context: Context,
    {
      limit = 20,
      offset,
      read,
      deleted,
    }: {limit: number; offset?: number; read?: boolean; deleted?: boolean}
  ): Promise<Connection<models.UserMessage>> {
    if (!context.user) {
      throw new Error('User not authenticated');
    }

    const query = models.UserMessage.query()
      .context(context)
      .where({userId: context.user.id});
    if (read != null) {
      if (read) {
        query.whereExists(models.UserMessage.relatedQuery('read'));
      } else {
        query.whereNotExists(models.UserMessage.relatedQuery('read'));
      }
    }
    if (deleted != null) {
      if (deleted) {
        query.whereExists(models.UserMessage.relatedQuery('deleted'));
      } else {
        query.whereNotExists(models.UserMessage.relatedQuery('deleted'));
      }
    }

    const countQuery = query.clone();
    query.eager('[category, read, deleted]').orderBy('createdAt', 'desc');
    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    const [{total}] = ((await countQuery.count(
      'user_notification.id as total'
    )) as unknown) as [{total: number}];

    const results = await query;

    return {
      results,
      total,
    };
  }

  public static async getCurrentUserMessageUnreadCount(
    context: Context
  ): Promise<number> {
    if (!context.user) {
      throw new Error('User not authenticated');
    }

    const query = models.UserMessage.query()
      .context(context)
      .where({userId: context.user.id})
      .whereNotExists(models.UserMessage.relatedQuery('read'))
      .whereNotExists(models.UserMessage.relatedQuery('deleted'));
    const [{total}] = ((await query.count(
      'user_message.id as total'
    )) as unknown) as [{total: number}];

    return total;
  }

  //TODO: create for multiple users?
  public static async create(
    context: Context,
    {userId, message}: UserNotificationCreateOptions
  ): Promise<models.UserMessage> {
    if (!context.user) {
      throw new Error('User not authenticated');
    }

    const result = await transaction(models.UserMessage.knex(), async (trx) => {
      // const notificationCategory = await models.NotificationCategory.query(
      //   trx
      // )
      //   .context(context)
      //   .findOne({category});

      // if (!notificationCategory) {
      //   throw new Error('Notification category not found');
      // }

      // TODO: must have system role
      return await models.UserMessage.query(trx)
        .context(context)
        .insert({
          userId,
          message,
          // ...addActiveStatusFields(startDate),
        });
      // .eager('[category]');
    });

    SubscriptionService.publishNewUserMessage({
      userId,
      message: result,
    });
    return result;
  }

  public static async markAllAsRead(context: Context) {
    return await transaction(models.UserMessage.knex(), async (trx) => {
      if (!context.user) {
        throw new Error('User not authenticated');
      }

      const userMessages = await models.UserMessage.query(trx)
        .context(context)
        .where({userId: context.user.id});

      const readNotifications: models.UserMessage[] = [];
      for (let i = 0; i < userMessages.length; i++) {
        const userNotification = userMessages[i];

        if (!userNotification.read) {
          await userNotification
            .$relatedQuery('read')
            .context(context)
            .insert({read: true});
        } else {
          console.log(
            `User message with ID: ${userNotification.id} has already been read.`
          );
        }
        readNotifications.push(userNotification);
      }
      return readNotifications;
    });
  }

  public static async markAllAsDeleted(context: Context) {
    return await transaction(models.UserMessage.knex(), async (trx) => {
      if (!context.user) {
        throw new Error('User not authenticated');
      }

      const userMessages = await models.UserMessage.query(trx)
        .context(context)
        .where({userId: context.user.id});

      const deletedNotifications: models.UserMessage[] = [];
      for (let i = 0; i < userMessages.length; i++) {
        const userNotification = userMessages[i];

        if (!userNotification.deleted) {
          await userNotification
            .$relatedQuery('deleted')
            .context(context)
            .insert({deleted: true});
        } else {
          console.log(
            `User message with ID: ${userNotification.id} has already been deleted.`
          );
        }
        deletedNotifications.push(userNotification);
      }
      return deletedNotifications;
    });
  }

  public static async markAsRead(
    context: Context,
    userNotificationIds: number[]
  ) {
    // const test
    return await transaction(models.UserMessage.knex(), async (trx) => {
      const userMessages = await models.UserMessage.query(trx)
        .context(context)
        .whereIn('id', userNotificationIds);

      const readNotifications: models.UserMessage[] = [];
      for (let i = 0; i < userMessages.length; i++) {
        const userNotification = userMessages[i];

        //TODO: handle when read is specified false?
        if (!userNotification.read) {
          await userNotification
            .$relatedQuery('read')
            .context(context)
            .insert({read: true});
        } else {
          console.log(
            `User message with ID: ${userNotification.id} has already been read.`
          );
        }
        readNotifications.push(userNotification);
      }
      return readNotifications;
    });
  }

  public static async markAsDeleted(
    context: Context,
    userNotificationIds: number[]
  ) {
    return await transaction(models.UserMessage.knex(), async (trx) => {
      const userMessages = await models.UserMessage.query(trx)
        .context(context)
        .whereIn('id', userNotificationIds);

      const deletedNotifications: models.UserMessage[] = [];
      for (let i = 0; i < userMessages.length; i++) {
        const userNotification = userMessages[i];

        //TODO: handle when read is specified false?
        if (!userNotification.deleted) {
          await userNotification
            .$relatedQuery('deleted')
            .context(context)
            .insert({deleted: true});
        } else {
          console.log(
            `User message with ID: ${userNotification.id} has already been deleted.`
          );
        }
        deletedNotifications.push(userNotification);
      }
      return deletedNotifications;
    });
  }
}

export default UserMessageService;
