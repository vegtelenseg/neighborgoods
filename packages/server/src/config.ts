import convict from 'convict';

const config = convict({
  env: {
    doc: 'The Neighborgoods Environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      env: 'POSTGRES_HOST',
      default: 'localhost',
    },
    database: {
      doc: 'Database name',
      format: String,
      env: 'POSTGRES_DATABASE',
      default: 'test',
    },
    user: {
      doc: 'Database username',
      env: 'POSTGRES_USERNAME',
      format: String,
      default: 'postgres',
    },
    port: {
      doc: 'Database Port',
      env: 'POSTGRES_PORT',
      format: Number,
      default: 5432,
    },
    password: {
      doc: 'Database password',
      format: String,
      env: 'POSTGRES_PASSWORD',
      default: 'password',
      sensitive: true,
    },
    debug: {
      doc: 'Enable Knex Debug',
      format: Boolean,
      env: 'KNEX_DEBUG',
      default: true,
    },
  },
  jaeger: {
    enabled: {
      doc: 'Jeager Tracing Enabled',
      format: 'Boolean',
      default: false,
      env: 'JAEGER_ENABLED',
    },
    agentHost: {
      doc: 'Jaeger Collection Endpoint',
      format: '*',
      env: 'JAEGER_AGENT_HOST',
      default: 'localhost',
    },
  },
  oauth: {
    secret: {
      doc: 'Oauth Secret',
      format: 'String',
      default: 'DFHDFHEARGREGD',
      env: 'OAUTH_SECRET',
      sensitive: true,
    },
    google: {
      clientId: {
        doc: 'Google Oauth ClientId',
        format: 'String',
        default:
          '942287288298-ktd9433hugca0b8rnisejc2277sva9d4.apps.googleusercontent.com',
        env: 'GOOGLE_OAUTH_CLIENT_ID',
      },
      clientSecret: {
        doc: 'Google Oauth Secret ClientSecret',
        format: 'String',
        default: 's3yjT30CsBLXSYGgwWOfRMwn',
        env: 'GOOGLE_OAUTH_CLIENT_SECRET',
        sensitive: true,
      },
    },
  },
});

export default config;
