/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ProductCategory_categories = {
    readonly productsByCategory: ReadonlyArray<{
        readonly name: string;
    }>;
    readonly " $refType": "ProductCategory_categories";
};
export type ProductCategory_categories$data = ProductCategory_categories;
export type ProductCategory_categories$key = {
    readonly " $data"?: ProductCategory_categories$data;
    readonly " $fragmentRefs": FragmentRefs<"ProductCategory_categories">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ProductCategory_categories",
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
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'e9f4a644d00335366a57f795cdc48f29';
export default node;
