import Context from '../context';
import {Product} from '../models/product';
import {transaction, Transaction} from 'objection';
import {addActiveStatusFields} from './helpers';

export interface CreateProductOptions {
  categoryId: number;
  price: string;
  name: string;
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
}
