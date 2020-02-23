/* tslint:disable */
/* eslint-disable */
/* @relayHash fde9ce39be72806a66a3f4901fbfae52 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeQueryVariables = {};
export type HomeQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"ProductCategory_categories">;
    };
};
export type HomeQuery = {
    readonly response: HomeQueryResponse;
    readonly variables: HomeQueryVariables;
};



/*
query HomeQuery {
  viewer {
    ...ProductCategory_categories
  }
}

fragment ProductCategory_categories on Viewer {
  productsByCategory {
    name
    id
  }
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ProductCategory_categories",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "productsByCategory",
            "storageKey": null,
            "args": null,
            "concreteType": "ProductCategory",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "HomeQuery",
    "id": null,
    "text": "query HomeQuery {\n  viewer {\n    ...ProductCategory_categories\n  }\n}\n\nfragment ProductCategory_categories on Viewer {\n  productsByCategory {\n    name\n    id\n  }\n}\n",
    "metadata": {}
  }
};
(node as any).hash = '9fbdaf0b67c597c9d797dc8147c93f2b';
export default node;
