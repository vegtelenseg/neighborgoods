import {Model} from 'objection';
import {BaseModel} from './base';
import Context from '../Context';
import {Product} from './product';

export class ProductCategory extends BaseModel<Context> {
  id!: number;
  name!: string;
  products!: Partial<Product>[];
  public static relationMappings() {
    return {
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'productCategory.id',
          through: {
            // systemDetail is used as the join table here
            from: 'productDetail.categoryId',
            to: 'productDetail.productId',
          },
          to: 'product.id',
        },
      },
    };
  }
}
