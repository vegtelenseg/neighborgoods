import {transaction, Transaction} from 'objection';
import Context from '../context';
import {Product, ProductAvailability, ProductStatus} from '../models/product';
import {addActiveStatusFields} from './helpers';
import {ProductAvailabilityType} from '../types';
import {ProductCategory} from '../models/productCategory';
import {PointInTimeState} from '../models/base';
import {UserProduct} from '../models/user';

export interface CreateProductOptions {
  categoryId: number;
  description?: string;
  price: string;
  name: string;
  startDate?: Date;
}

interface UpdateAvailabilityOptions {
  productId: number;
  sold: ProductAvailabilityType;
  startDate?: Date;
}

const PRODUCTS_EAGER = '[availability, detail(active)]';

export class ProductService {
  public static async fetchProductsByCategoryId(
    context: Context,
    categoryId: number
  ) {
    const categoryProductsById = ProductCategory.query()
      .context(context)
      .joinEager(
        '[products.[detail(active).[category], statuses(active), availability(active)]]'
      )

      //make sure we only return active systems
      .whereExists(
        ProductStatus.query()
          .whereColumn('products.id', 'productStatus.productId')
          .andWhere({state: PointInTimeState.active})
      )
      .andWhere({
        'product_category.id': categoryId,
      })
      .findOne(true);
    return categoryProductsById;
  }
  public static async fetchProductsByCategory(
    context: Context,
    //linkedToUser provides information whether the user wants systems that are, or aren't linked to them
    //if not provided, will return all systems
    linkedToUser?: boolean
  ) {
    const categoryProducts = ProductCategory.query()
      .context(context)
      .joinEager(
        '[products.[detail(active).[category], statuses(active), availability(active)]]'
      )
      //make sure we only return active systems
      .whereExists(
        ProductStatus.query()
          .whereColumn('products.id', 'productStatus.productId')
          .andWhere({state: PointInTimeState.active})
      );

    if (linkedToUser !== undefined) {
      if (!context.user) {
        throw new Error(
          'User context is undefined. Cannot return systems for user'
        );
      }

      const filterQuery = UserProduct.query()
        .whereColumn('product.id', 'userProduct.productId')
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .andWhere({userId: context.user!.id, state: PointInTimeState.active});

      if (linkedToUser) {
        categoryProducts.whereExists(filterQuery);
      } else {
        categoryProducts.whereNotExists(filterQuery);
      }
    }
    return await categoryProducts;
  }
  public static async create(
    context: Context,
    {
      categoryId,
      name,
      price,
      description,
      startDate = new Date(),
    }: CreateProductOptions
  ): Promise<Product> {
    return transaction(Product.knex(), async (trx: Transaction) => {
      const system = await Product.query(trx)
        .context(context)
        .insertGraphAndFetch({
          detail: [
            {
              categoryId,
              price,
              description,
              name,
              ...addActiveStatusFields(startDate),
            },
          ],
          statuses: [addActiveStatusFields(startDate)],
        });
      return system;
    });
  }

  public static async updateAvailability(
    context: Context,
    {productId, sold, startDate = new Date()}: UpdateAvailabilityOptions
  ): Promise<ProductAvailability> {
    const newProductAvailabilityInfo = await transaction(
      ProductAvailability.knex(),
      async (trx: Transaction) => {
        const product = await Product.query(trx)
          //  .eager('[availability, detail(active)]')
          .context(context)
          .eager(PRODUCTS_EAGER)
          .context(context)
          .findById(productId);
        if (!product) {
          throw new Error(`Product with id ${productId} not found`);
        }

        const currentActiveAvailability = product.activeAvailability;

        if (currentActiveAvailability) {
          await currentActiveAvailability.deactivate(context, trx, startDate);
        }

        console.log('PRODUCT ID: ', productId);
        const productAvailability = await ProductAvailability.query(trx)
          .context(context)
          .eager('[product]')
          // .skipUndefined()
          .insertGraphAndFetch({
            productId,
            sold,
            ...addActiveStatusFields(startDate),
          })
          .skipUndefined();

        return {
          newSystemAvailability: productAvailability,
          systemName: product.activeDetail
            ? product.activeDetail.name
            : 'NO NAME',
        };
      }
    );
    return newProductAvailabilityInfo.newSystemAvailability;
  }
}
