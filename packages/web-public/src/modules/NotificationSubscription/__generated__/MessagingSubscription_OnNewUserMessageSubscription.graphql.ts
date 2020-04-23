/* tslint:disable */
/* eslint-disable */
/* @relayHash f3cf7ca84ecfe6d8f65b44d9b35f96b7 */

import { ConcreteRequest } from "relay-runtime";
export type MessagingSubscription_OnNewUserMessageSubscriptionVariables = {};
export type MessagingSubscription_OnNewUserMessageSubscriptionResponse = {
    readonly onNewUserMessage: {
        readonly message: {
            readonly id: string;
            readonly message: string;
            readonly read: boolean;
            readonly createdAt: unknown;
        };
        readonly messagesCount: {
            readonly unread: number;
        };
    };
};
export type MessagingSubscription_OnNewUserMessageSubscription = {
    readonly response: MessagingSubscription_OnNewUserMessageSubscriptionResponse;
    readonly variables: MessagingSubscription_OnNewUserMessageSubscriptionVariables;
};



/*
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
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "message",
  "storageKey": null,
  "args": null,
  "concreteType": "UserMessage",
  "plural": false,
  "selections": [
    (v0/*: any*/),
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
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "unread",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MessagingSubscription_OnNewUserMessageSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "onNewUserMessage",
        "storageKey": null,
        "args": null,
        "concreteType": "UserMessageUpdate",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messagesCount",
            "storageKey": null,
            "args": null,
            "concreteType": "ViewerMessageCount",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MessagingSubscription_OnNewUserMessageSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "onNewUserMessage",
        "storageKey": null,
        "args": null,
        "concreteType": "UserMessageUpdate",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messagesCount",
            "storageKey": null,
            "args": null,
            "concreteType": "ViewerMessageCount",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v0/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "subscription",
    "name": "MessagingSubscription_OnNewUserMessageSubscription",
    "id": null,
    "text": "subscription MessagingSubscription_OnNewUserMessageSubscription {\n  onNewUserMessage {\n    message {\n      id\n      message\n      read\n      createdAt\n    }\n    messagesCount {\n      unread\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'a9f5e04eaee0c32a9dac44844434df42';
export default node;
