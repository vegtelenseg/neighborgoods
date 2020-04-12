import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import Context from '../context';
import {ProductService} from '../services/ProductService';

// import {User} from '../models';

const typeSymbol = Symbol('type');

async function retrieveById(context: Context, type: string, id: number) {
  switch (type) {
    case 'ProductCategory': {
      const productsCategory = await ProductService.fetchProductsByCategoryId(
        context,
        id
      );
      console.log('PRODUCTS: ', productsCategory);
      return productsCategory;
    }
    default:
      console.log('PRODUC: ');
      break;
  }
  return null;
}

const {nodeField, nodeInterface} = nodeDefinitions<Context>(
  async (globalId, context) => {
    const {type, id} = fromGlobalId(globalId);
    const result = await retrieveById(context, type, Number(id));

    if (result) {
      // @ts-ignore
      result[typeSymbol] = type;
      return result;
    }
    return null;
  },
  (obj) => obj[typeSymbol]
);

export {nodeInterface, nodeField};
