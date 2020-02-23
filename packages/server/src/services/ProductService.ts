import {transaction, Transaction} from 'objection';
import Context from '../context';
import {Product, ProductAvailability} from '../models/product';
import {addActiveStatusFields} from './helpers';
import {ProductAvailabilityType} from '../types';

export interface CreateProductOptions {
  categoryId: number;
  price: string;
  name: string;
  startDate?: Date;
}

interface UpdateAvailabilityOptions {
  productId: number;
  sold: ProductAvailabilityType;
  startDate?: Date;
}

export class ProductService {
  public static async create(
    context: Context,
    {categoryId, name, price, startDate = new Date()}: CreateProductOptions
  ): Promise<Product> {
    return transaction(Product.knex(), async (trx: Transaction) => {
      const system = await Product.query(trx)
        .context(context)
        .insertGraphAndFetch({
          detail: [
            {
              categoryId,
              price,
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
          .eager('[availability, detail(active)]')
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
