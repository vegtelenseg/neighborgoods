/* tslint:disable */
/* eslint-disable */
/* @relayHash b6669b5c512c050369a9ebcbb10986ca */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeQueryVariables = {};
export type HomeQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"ProductCategories_categories">;
    };
};
export type HomeQuery = {
    readonly response: HomeQueryResponse;
    readonly variables: HomeQueryVariables;
};



/*
query HomeQuery {
  viewer {
    ...ProductCategories_categories
  }
}

fragment ProductCategories_categories on Viewer {
  productsByCategory {
    id
    name
    imageUri
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
            "name": "ProductCategories_categories",
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
                "name": "id",
                "args": null,
                "storageKey": null
              },
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
                "name": "imageUri",
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
    "text": "query HomeQuery {\n  viewer {\n    ...ProductCategories_categories\n  }\n}\n\nfragment ProductCategories_categories on Viewer {\n  productsByCategory {\n    id\n    name\n    imageUri\n  }\n}\n",
    "metadata": {}
  }
};
(node as any).hash = '3cfb9c985917036b71d3cd04d235bbad';
export default node;
