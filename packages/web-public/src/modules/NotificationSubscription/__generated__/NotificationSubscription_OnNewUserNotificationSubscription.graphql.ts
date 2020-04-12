/* tslint:disable */
/* eslint-disable */
/* @relayHash 73a3c16479f465f9bb7eb8d3a18b2391 */

import { ConcreteRequest } from "relay-runtime";
export type NotificationSubscription_OnNewUserNotificationSubscriptionVariables = {};
export type NotificationSubscription_OnNewUserNotificationSubscriptionResponse = {
    readonly onNewUserMessage: {
        readonly message: {
            readonly id: string;
            readonly message: string;
            readonly read: boolean;
            readonly createdAt: unknown;
        };
    };
};
export type NotificationSubscription_OnNewUserNotificationSubscription = {
    readonly response: NotificationSubscription_OnNewUserNotificationSubscriptionResponse;
    readonly variables: NotificationSubscription_OnNewUserNotificationSubscriptionVariables;
};



/*
subscription NotificationSubscription_OnNewUserNotificationSubscription {
  onNewUserMessage {
    message {
      id
      message
      read
      createdAt
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "onNewUserMessage",
    "storageKey": null,
    "args": null,
    "concreteType": "UserNotificationUpdate",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "message",
        "storageKey": null,
        "args": null,
        "concreteType": "UserMessage",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "message",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "read",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "createdAt",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "NotificationSubscription_OnNewUserNotificationSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "NotificationSubscription_OnNewUserNotificationSubscription",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "NotificationSubscription_OnNewUserNotificationSubscription",
    "id": null,
    "text": "subscription NotificationSubscription_OnNewUserNotificationSubscription {\n  onNewUserMessage {\n    message {\n      id\n      message\n      read\n      createdAt\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '0d52670df20fbbf95279170bd09cc0d9';
export default node;
