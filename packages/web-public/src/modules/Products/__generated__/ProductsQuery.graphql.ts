/* tslint:disable */
/* eslint-disable */
/* @relayHash 53b5ca8ca10720fd2e60eaf260082d19 */

import { ConcreteRequest } from "relay-runtime";
export type ProductAvailabilityEnum = "AVAILABLE" | "SOLD" | "%future added value";
export type ProductsQueryVariables = {
    id: string;
};
export type ProductsQueryResponse = {
    readonly node: {
        readonly name?: string;
        readonly products?: ReadonlyArray<{
            readonly id: string;
            readonly detail: {
                readonly name: string;
                readonly description: string | null;
                readonly price: number;
            };
            readonly currentAvailability: {
                readonly availability: ProductAvailabilityEnum;
            };
        }>;
    } | null;
};
export type ProductsQuery = {
    readonly response: ProductsQueryResponse;
    readonly variables: ProductsQueryVariables;
};



/*
query ProductsQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ... on ProductCategory {
      name
      products {
        id
        detail {
          name
          description
          price
          id
        }
        currentAvailability {
          availability
          id
        }
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "description",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "price",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "availability",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProductsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "ProductCategory",
            "selections": [
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "products",
                "storageKey": null,
                "args": null,
                "concreteType": "Product",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "detail",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ProductDetail",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "currentAvailability",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ProductAvailability",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ProductsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "ProductCategory",
            "selections": [
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "products",
                "storageKey": null,
                "args": null,
                "concreteType": "Product",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "detail",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ProductDetail",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v3/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "currentAvailability",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ProductAvailability",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ProductsQuery",
    "id": null,
    "text": "query ProductsQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ProductCategory {\n      name\n      products {\n        id\n        detail {\n          name\n          description\n          price\n          id\n        }\n        currentAvailability {\n          availability\n          id\n        }\n      }\n    }\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '64eb8f1f7371cb878b0a940e0636e0da';
export default node;
