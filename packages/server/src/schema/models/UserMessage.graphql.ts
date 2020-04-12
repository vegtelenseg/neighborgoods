/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {globalIdField} from 'graphql-relay';
import {GraphQLDateTime} from 'graphql-iso-date';
// import {NotificationCategory} from './UserNotificationCategoryConfig.graphql';
import {UserMessage as UserMessageModel} from '../../models';
import {nodeInterface} from '../Relay';
//parent should always be a notification with it's readStatus

export const UserMessage = new GraphQLObjectType({
  name: 'UserMessage',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField('UserMessage'),
    message: {
      type: GraphQLNonNull(GraphQLString),
    },
    read: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent: UserMessageModel) => {
        if (!parent.read) {
          return false;
        } else return parent.read.read;
      },
    },
    deleted: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent: UserMessageModel) => {
        if (!parent.deleted) {
          return false;
        } else return parent.deleted.deleted;
      },
    },
    createdAt: {
      type: GraphQLNonNull(GraphQLDateTime),
    },
  }),
});
