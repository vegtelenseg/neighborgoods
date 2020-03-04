/* tslint:disable */
/* eslint-disable */
/* @relayHash 4aa8aa9540ba922e3da40c7fe1687184 */

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
    name
    imageUri
    products {
      id
      detail {
        name
        id
      }
      currentAvailability {
        availability
        id
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
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
              (v0/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "imageUri",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "products",
                "storageKey": null,
                "args": null,
                "concreteType": "Product",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "detail",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ProductDetail",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v1/*: any*/)
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "availability",
                        "args": null,
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ]
                  }
                ]
              },
              (v1/*: any*/)
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
    "text": "query HomeQuery {\n  viewer {\n    ...ProductCategories_categories\n  }\n}\n\nfragment ProductCategories_categories on Viewer {\n  productsByCategory {\n    name\n    imageUri\n    products {\n      id\n      detail {\n        name\n        id\n      }\n      currentAvailability {\n        availability\n        id\n      }\n    }\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3cfb9c985917036b71d3cd04d235bbad';
export default node;
