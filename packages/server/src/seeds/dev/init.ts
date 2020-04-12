import Knex from 'knex';
import {startSpan} from '../../util';
import {UserService, CreateUserOptions} from '../../services/UserService';
import tracer from '../../tracer';
import {ProductService} from '../../services/ProductService';
import {ProductCategory} from '../../models/productCategory';
import {categoryData} from './categories/categoryData';

export async function seed(knex: Knex) {
  await knex('user_status').del();
  await knex('user_profile').del();
  await knex('product_availability').del();
  await knex('product_schedule').del();
  await knex('user_product').del();
  await knex('product_status').del();
  await knex('product_detail').del();
  await knex('product_category').del();
  await knex('product').del();
  await knex('users').del();

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
      name: categoryData[0].title,
      imageUri: categoryData[0].img,
    });
  const product1 = await ProductService.create(context, {
    categoryId: category1.id,
    name: 'RALEIGH - 29" RAZOR FRONT SUSPENSION',
    description:
      '29″ Aluminium frame; Raleigh Front Suspension; Shimano 21Speed rear derailleur; Shimano 21 speed twist shifters; Mechanical disc brakes; A headset',
    price: '10',
  });
  await ProductService.updateAvailability(context, {
    productId: product1.id,
    sold: 'SOLD',
  });

  const category2 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[1].title,
      imageUri: categoryData[1].img,
    });
  const product2 = await ProductService.create(context, {
    categoryId: category2.id,
    name: 'DELL - E1916HV MONITOR',
    description:
      'Dell E1916HV 18.5 Inch LED Monitor Screen performance: View your applications, spreadsheets and more on 18.5 inches of 1366×768 HD clarity, with 16.7 million colors, a color gamut of 85 percenti and a 90° / 65° horizontal / vertical viewing angle. Plug and view: Compatible with both legacy and non-legacy PCs via VGA',
    price: '1900',
  });
  await ProductService.updateAvailability(context, {
    productId: product2.id,
    sold: 'AVAILABLE',
  });

  const category3 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[2].title,
      imageUri: categoryData[2].img,
    });

  const product3 = await ProductService.create(context, {
    categoryId: category3.id,
    name: 'Short Pants',
    price: '150',
  });
  await ProductService.updateAvailability(context, {
    productId: product3.id,
    sold: 'AVAILABLE',
  });

  const category4 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[3].title,
      imageUri: categoryData[3].img,
    });
  const product4 = await ProductService.create(context, {
    categoryId: category4.id,
    name: 'NIVEA',
    price: '70',
  });
  await ProductService.updateAvailability(context, {
    productId: product4.id,
    sold: 'AVAILABLE',
  });

  const category5 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[4].title,
      imageUri: categoryData[4].img,
    });
  const product5 = await ProductService.create(context, {
    categoryId: category5.id,
    name: 'DELL - Computer',
    price: '2000',
  });
  await ProductService.updateAvailability(context, {
    productId: product5.id,
    sold: 'AVAILABLE',
  });
  // @ts-ignore
  const category6 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[5].title,
      imageUri: categoryData[5].img,
    });
  const product6 = await ProductService.create(context, {
    categoryId: category6.id,
    name: 'Sofa',
    price: '7000',
  });
  await ProductService.updateAvailability(context, {
    productId: product6.id,
    sold: 'SOLD',
  });
  // @ts-ignore
  const category7 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[6].title,
      imageUri: categoryData[6].img,
    });
  const product7 = await ProductService.create(context, {
    categoryId: category7.id,
    name: 'Aersol',
    price: '50',
  });
  await ProductService.updateAvailability(context, {
    productId: product7.id,
    sold: 'AVAILABLE',
  });
  // @ts-ignore
  const category8 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[7].title,
      imageUri: categoryData[7].img,
    });
  const product8 = await ProductService.create(context, {
    categoryId: category8.id,
    name: 'Aersol',
    price: '50',
  });
  await ProductService.updateAvailability(context, {
    productId: product8.id,
    sold: 'SOLD',
  });

  // @ts-ignore
  const category9 = await ProductCategory.query()
    .context(context)
    .insertGraphAndFetch({
      name: categoryData[8].title,
      imageUri: categoryData[8].img,
    });
  const product9 = await ProductService.create(context, {
    categoryId: category9.id,
    name: 'Mercedes-Benz Engine',
    description:
      'Designed to give reliable service under prolonged hard use, the iron block/aluminum head engine featured deep water jackets',
    price: '50000',
  });
  await ProductService.updateAvailability(context, {
    productId: product9.id,
    sold: 'AVAILABLE',
  });
  const user1Info: CreateUserOptions = {
    credentials: {
      username: 'a@a.com',
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
