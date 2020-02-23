import {transaction, Transaction} from 'objection';
import {User} from '../models';
import Context from '../context';
import {addActiveStatusFields} from './helpers';
import {PointInTimeState} from '../models/base';
import {UserStatus} from '../models/user';

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

const USER_EAGER_RELATIONS =
  '[profile(active), statuses(active), userProducts(active).[product.[availability(active), detail(active)]]]';

export class UserService {
  public static async FetchUserById(
    context: Context,
    userId: number,
    eagerRelations: string = USER_EAGER_RELATIONS,
    trx?: Transaction
  ): Promise<User> {
    const user = await User.query(trx)
      .eager(eagerRelations)
      .context(context)
      .findById(userId);
    if (!user) throw new Error('User was not found');
    return user;
  }

  public static async findByUsername(
    context: Context,
    username: string,
    trx?: Transaction
  ): Promise<User | undefined> {
    try {
      return User.query(trx)
        .context(context)
        .eager(USER_EAGER_RELATIONS)
        .whereExists(
          UserStatus.query()
            .whereColumn('users.id', 'userStatus.userId')
            .andWhere({state: PointInTimeState.active})
        )
        .findOne('username', username);
    } catch (err) {
      throw new Error(`User with username ${username} could not be found.`);
    }
  }

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
