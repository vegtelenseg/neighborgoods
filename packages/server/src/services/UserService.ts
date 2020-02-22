import {User} from '../models';
import {transaction, Transaction} from 'objection';
import Context from '../context';
import {addActiveStatusFields} from './helpers';

// const USER_EAGER_RELATIONS = '[profile(active), statuses(active)]';

interface UserCredentials {
  username: string;
  password: string;
}

interface UserProfile {
  unitNumber: number;
  email?: string;
  profileName?: string;
  cellPhoneNumber?: string;
}

export interface CreateUserOptions {
  credentials: UserCredentials;
  profile: UserProfile;
  products: {productId: number}[];
  startDate?: Date;
}

export class UserService {
  public static async create(
    context: Context,
    userInfo: CreateUserOptions,
    startDate = new Date()
  ): Promise<User> {
    return transaction(User.knex(), async (trx: Transaction) => {
      if (!context.user) {
        throw new Error('User context is not available.');
      }
      if (!context.user.id) {
        const systemUser = await User.query(trx)
          .context(context)
          .findOne({username: 'system'});

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        context.user.id = systemUser!.id;
      }
      const user = await User.query(trx)
        .context(context)
        .insertGraphAndFetch({
          ...userInfo.credentials,
          profile: [
            {
              ...userInfo.profile,
              ...addActiveStatusFields(startDate),
            },
          ],
          userProducts: userInfo.products.map((product) => {
            return {
              productId: product.productId,
              ...addActiveStatusFields(startDate),
            };
          }),
          statuses: [addActiveStatusFields(startDate)],
        });
      return user;
    });
  }
}
