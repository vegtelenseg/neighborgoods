/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ProductAvailabilityEnum = "AVAILABLE" | "SOLD" | "%future added value";
export type ProductCategories_categories = {
    readonly productsByCategory: ReadonlyArray<{
        readonly name: string;
        readonly imageUri: string;
        readonly products: ReadonlyArray<{
            readonly id: string;
            readonly detail: {
                readonly name: string;
            };
            readonly currentAvailability: {
                readonly availability: ProductAvailabilityEnum;
            };
        }>;
    }>;
    readonly " $refType": "ProductCategories_categories";
};
export type ProductCategories_categories$data = ProductCategories_categories;
export type ProductCategories_categories$key = {
    readonly " $data"?: ProductCategories_categories$data;
    readonly " $fragmentRefs": FragmentRefs<"ProductCategories_categories">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ProductCategories_categories",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
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
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "detail",
              "storageKey": null,
              "args": null,
              "concreteType": "ProductDetail",
              "plural": false,
              "selections": [
                (v0/*: any*/)
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
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '20f2348110e869f8cd7bae08b1c4745c';
export default node;
