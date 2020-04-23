import * as React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {ReactRelayContext} from 'relay-hooks';
import {requestSubscription, Environment} from 'react-relay';

import {ConnectionHandler} from 'relay-runtime';
import {MessagingSubscription_OnNewUserMessageSubscription} from './__generated__/MessagingSubscription_OnNewUserMessageSubscription.graphql';

const subscription = graphql`
  subscription MessagingSubscription_OnNewUserMessageSubscription {
    onNewUserMessage {
      message {
        id
        message
        read
        createdAt
      }
      messagesCount {
        unread
      }
    }
  }
`;

export function MessagingSubscription() {
  const {environment}: {environment: Environment} = React.useContext(
    ReactRelayContext
  );

  React.useEffect(() => {
    console.log('About to dispose');

    try {
      const disposer = requestSubscription<
        MessagingSubscription_OnNewUserMessageSubscription
      >(environment, {
        subscription,
        variables: {},
        onCompleted: () => {},
        updater(store) {
          const viewer = store.getRoot().getLinkedRecord('viewer');
          if (viewer) {
            const viewerNotifications = ConnectionHandler.getConnection(
              viewer,
              'Viewer_messages',
              {}
            );

            const rootField = store.getRootField('onNewUserNotification');
            if (rootField) {
              const message = rootField.getLinkedRecord('message');
              if (viewerNotifications && message) {
                const edge = ConnectionHandler.createEdge(
                  store,
                  viewerNotifications,
                  message,
                  'ViewerMessagesEdge'
                );

                ConnectionHandler.insertEdgeBefore(viewerNotifications, edge);
              }
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
    } catch (error) {
      console.log('ERROR: ', error.message);
    }
  }, [environment]);

  return null;
}
