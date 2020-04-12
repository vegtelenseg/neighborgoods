import {RedisPubSub} from 'graphql-redis-subscriptions';
import config from './config';
const {host, port} = config.get('redis');
export default new RedisPubSub({
  connection: {
    host,
    port,
    // retry_strategy: (options) => {
    //   // reconnect after
    //   return Math.max(options.attempt * 100, 3000);
    // },
  },
});
