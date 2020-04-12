import * as React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {ReactRelayContext} from 'relay-hooks';
import {requestSubscription, Environment} from 'react-relay';

import {NotificationSubscription_OnNewUserNotificationSubscriptionResponse} from './__generated__/NotificationSubscription_OnNewUserNotificationSubscription.graphql';
import {ConnectionHandler} from 'relay-runtime';

const subscription = graphql`
  subscription NotificationSubscription_OnNewUserNotificationSubscription {
    onNewUserNotification {
      notification {
        id
        title
        message
        read
        category
        createdAt
        markedCritical
        linkType
        linkId
        linkUri
      }
      notificationsCount {
        unread
      }
    }
  }
`;

export function NotificationSubscription() {
  const {environment}: {environment: Environment} = React.useContext(
    ReactRelayContext
  );

  React.useEffect(() => {
    const disposer = requestSubscription<
      NotificationSubscription_OnNewUserNotificationSubscriptionResponse
    >(environment, {
      subscription,
      variables: {},
      onCompleted: () => {},
      updater(store) {
        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (viewer) {
          const viewerNotifications = ConnectionHandler.getConnection(
            viewer,
            'Viewer_notifications',
            {}
          );

          const rootField = store.getRootField('onNewUserNotification');
          const notification = rootField.getLinkedRecord('notification');

          if (viewerNotifications) {
            const edge = ConnectionHandler.createEdge(
              store,
              viewerNotifications,
              notification,
              'ViewerNotificationsEdge'
            );

            ConnectionHandler.insertEdgeBefore(viewerNotifications, edge);
          }
        }
      },
      onNext(response) {
        if (response) {
          // NotifyUsers(
          //   response.onNewUserNotification.notification.title,
          //   response.onNewUserNotification.notification.message
          // );
          // Toast(
          //   'SUCCESS',
          //   `The status of ${response.onNewUserNotification.notification.title} has been updated.`
          // );
        }
      },
      onError: (error) => alert(error),
    });

    return () => {
      disposer.dispose();
    };
  }, [environment]);

  return null;
}
