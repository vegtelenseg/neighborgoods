import Knex from 'knex';
import {startSpan} from '../../util';
import {UserService, CreateUserOptions} from '../../services/UserService';
import tracer from '../../tracer';
import {ProductService} from '../../services/ProductService';
import {ProductCategory} from '../../models/productCategory';
import {UserProduct} from '../../models/user';
import {addActiveStatusFields} from '../../services/helpers';

export async function seed(_knex: Knex) {
  // await knex.del('users')
  const createSeedContext = async () => {
    return {
      user: {
        id: 1,
        username: 'system',
      },
      span: tracer.startSpan('seed'),
      startSpan,
    };
  };
  const context = await createSeedContext();
  const category1 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: 'Electronics',
    });
  const product1 = await ProductService.create(context, {
    categoryId: category1.id,
    name: 'Bicycle',
    price: '10',
  });
  const product2 = await ProductService.create(context, {
    categoryId: category1.id,
    name: 'Dell Computer Monitor (27")',
    price: '1900',
  });
  const user1Info: CreateUserOptions = {
    credentials: {
      username: '1000',
      password: 'password',
    },
    profile: {
      profileName: 'Siya',
      unitNumber: 357,
      cellPhoneNumber: '0659455109',
      email: 'email@xample.io',
    },
    products: [
      {productId: product1.id},
      {productId: product2.id},
      {productId: product1.id},
      {productId: product2.id},
    ],
  };
  const user1 = await UserService.create(context, user1Info);

  await UserProduct.query()
    .context(context)
    .insertGraphAndFetch({
      userId: user1.id,
      productId: product1.id,
      ...addActiveStatusFields(new Date()),
    });
}
