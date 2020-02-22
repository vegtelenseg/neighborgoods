import Knex from 'knex';
import {startSpan} from '../../util';
import {UserService, CreateUserOptions} from '../../services/UserService';
import tracer from '../../tracer';
import {ProductService} from '../../services/ProductService';
import {ProductCategory} from '../../models/productCategory';

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

  const category2 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: 'Electronics',
    });
  const category1 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: 'Outdoor',
    });

  const product1 = await ProductService.create(context, {
    categoryId: category1.id,
    name: 'RALEIGH - 29" RAZOR FRONT SUSPENSION',
    price: '10',
  });
  await ProductService.updateAvailability(context, {
    productId: product1.id,
    sold: 'SOLD',
  });

  const product2 = await ProductService.create(context, {
    categoryId: category2.id,
    name: 'DELL - E1916HV MONITOR',
    price: '1900',
  });
  await ProductService.updateAvailability(context, {
    productId: product2.id,
    sold: 'AVAILABLE',
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
    products: [{productId: product1.id}, {productId: product2.id}],
  };
  await UserService.create(context, user1Info);

  // await UserProduct.query()
  //   .context(context)
  //   .insertGraphAndFetch({
  //     userId: user1.id,
  //     productId: product1.id,
  //     ...addActiveStatusFields(new Date()),
  //   });
}
