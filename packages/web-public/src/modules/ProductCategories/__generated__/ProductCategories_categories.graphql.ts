/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ProductCategories_categories = {
    readonly productsByCategory: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
        readonly imageUri: string;
    }> | null;
    readonly " $refType": "ProductCategories_categories";
};
export type ProductCategories_categories$data = ProductCategories_categories;
export type ProductCategories_categories$key = {
    readonly " $data"?: ProductCategories_categories$data;
    readonly " $fragmentRefs": FragmentRefs<"ProductCategories_categories">;
};



const node: ReaderFragment = {
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
};
(node as any).hash = '4e1fdaaaa1add9ecdb77b1bc9bc8e100';
export default node;
