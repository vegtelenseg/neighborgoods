/* tslint:disable */
/* eslint-disable */
/* @relayHash c1e1448c056b915b21afe8367e506610 */

import { ConcreteRequest } from "relay-runtime";
export type LoginInput = {
    username: string;
    password: string;
    clientMutationId?: string | null;
};
export type LoginMutationVariables = {
    input: LoginInput;
};
export type LoginMutationResponse = {
    readonly loginMutation: {
        readonly token: string | null;
        readonly username: string | null;
    } | null;
};
export type LoginMutation = {
    readonly response: LoginMutationResponse;
    readonly variables: LoginMutationVariables;
};



/*
mutation LoginMutation(
  $input: LoginInput!
) {
  loginMutation(input: $input) {
    token
    username
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "LoginInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "loginMutation",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "LoginPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "token",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "username",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "LoginMutation",
    "type": "Mutations",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "LoginMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "LoginMutation",
    "id": null,
    "text": "mutation LoginMutation(\n  $input: LoginInput!\n) {\n  loginMutation(input: $input) {\n    token\n    username\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '4fd7615680aea661e44f96721016d551';
export default node;
