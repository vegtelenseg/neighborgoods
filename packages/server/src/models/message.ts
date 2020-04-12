import {Model} from 'objection';
import {BaseModel} from './base';
import Context from '../Context';

export class UserMessageRead extends BaseModel<Context> {
  public readonly id!: number;
  public userMessageId!: number;
  public read!: boolean;
}

export class UserMessageDeleted extends BaseModel<Context> {
  public readonly id!: number;
  public userMessageId!: number;
  public deleted!: boolean;
}

export class UserMessage extends BaseModel<Context> {
  public readonly id!: number;
  public userId!: number;
  public message!: string;
  public read?: Partial<UserMessageRead>;
  public deleted?: Partial<UserMessageDeleted>;

  public static relationMappings() {
    return {
      read: {
        relation: Model.HasOneRelation,
        modelClass: UserMessageRead,
        join: {
          from: 'userNotification.id',
          to: 'userNotificationRead.userNotificationId',
        },
      },
      deleted: {
        relation: Model.HasOneRelation,
        modelClass: UserMessageDeleted,
        join: {
          from: 'userNotification.id',
          to: 'userNotificationDeleted.userNotificationId',
        },
      },
    };
  }
}
