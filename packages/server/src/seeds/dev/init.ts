import Knex from 'knex';
import {startSpan} from '../../util';
import {UserService, CreateUserOptions} from '../../services/UserService';
import tracer from '../../tracer';

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
  };
  await UserService.create(context, user1Info);
}
