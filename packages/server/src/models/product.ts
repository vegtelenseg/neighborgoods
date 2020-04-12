import {Model} from 'objection';
import {PointInTimeModel, AggregateRoot} from './base';
import Context from '../context';
import {ProductCategory} from './productCategory';
import {ProductAvailabilityType} from '../types';

export class ProductStatus extends PointInTimeModel<Context> {
  productId!: number;
}

export class ProductDetail extends PointInTimeModel<Context> {
  productId!: number;
  price!: string;
  categoryId!: number;
  description?: string;
  name!: string;
  category!: ProductCategory;
  endpoint?: string;

  public static get relationMappings() {
    return {
      category: {
        relation: Model.HasOneRelation,
        modelClass: ProductCategory,
        join: {
          from: 'productDetail.categoryId',
          to: 'productCategory.id',
        },
      },
    };
  }
}

export class Product extends AggregateRoot<Context> {
  public detail!: Partial<ProductDetail>[];
  public statuses!: Partial<ProductStatus>[];
  public availability!: Partial<ProductAvailability>[];

  public get activeDetail(): ProductDetail | undefined {
    return this.getActiveRecordIfPresent(this.detail);
  }

  public get activeAvailability(): ProductAvailability | undefined {
    return this.getActiveRecordIfPresent(this.availability);
  }

  public static get relationMappings() {
    return {
      detail: {
        relation: Model.HasManyRelation,
        modelClass: ProductDetail,
        join: {
          from: 'product.id',
          to: 'productDetail.productId',
        },
      },
      availability: {
        relation: Model.HasManyRelation,
        modelClass: ProductAvailability,
        join: {
          from: 'product.id',
          to: 'productAvailability.productId',
        },
      },
      statuses: {
        relation: Model.HasManyRelation,
        modelClass: ProductStatus,
        join: {
          from: 'product.id',
          to: 'productStatus.productId',
        },
      },
    };
  }
}

export class ProductAvailability extends PointInTimeModel<Context> {
  public productId!: number;
  public sold!: ProductAvailabilityType;
  public message!: string;
  public product!: Partial<Product>;

  public static relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'productAvailability.productId',
          to: 'product.id',
        },
      },
    };
  }
}
