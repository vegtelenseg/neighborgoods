const express = require('express');
import {Request} from 'express';
import {ApolloServer} from 'apollo-server-express';
import OpentracingExtension from 'apollo-opentracing';
import cors from 'cors';
import helmet from 'helmet';
// import passport from 'passport';
// import GoogleStrategy from 'passport-google-oauth20';

// import config from '../config';
// const {clientId, clientSecret} = config.get('oauth.google');
// const {api: apiUrl} = config.get('url');
//import graphqlHTTP from 'express-graphql';
import schema from '../schema';
import tracer from '../tracer';

//const autoRegister = true;

const app = express();
app.use(cors());
app.use(helmet());
// class CustomGoogleStrategy extends GoogleStrategy {
//   // eslint-disable-next-line
//   public authorizationParams(options: any) {
//     const params = super.authorizationParams(options);

//     if (options.state) {
//       // @ts-ignore
//       params.state = options.state;
//     }

//     return params;
//   }
// }

// passport.use(  new CustomGoogleStrategy(
//   {
//     passReqToCallback: true,
//     clientID: clientId,
//     clientSecret,
//     scope: ['email', 'openid'],
//     // OpenId Connect
//     userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
//     callbackURL: `${apiUrl}/auth/google/callback`,
//   },
//   async (
//     req: Request,
//     _accessToken: string,
//     _refreshToken: string,
//     profile: any,
//     cb: any
//   ) => {
//     // TODO check if email has been verified
//     const [{value: email /* verified */}] = profile.emails;

//     const context = createContext(req);

//     try {
//       const user = await UserService.findByUsername(context, email);

//       if (user) {
//         return cb(null, user);
//       } else if (autoRegister) {
//         // tslint:disable-next-line no-console
//         console.log('Auto Registering User...');
//         // TODO whitelist stackworx.io for admin roles
//         // TODO
//         // user = await userService.create(context, {username: email});
//         return cb(null, user);
//       }

//       return cb(new Error(`User ${email} not found.`));
//     } catch (ex) {
//       return cb(ex);
//     }
//   }
// ));

// @ts-ignore
app.post('/login', (req, res) => console.log('Yup'));

const apolloServer = new ApolloServer({
  schema,
  subscriptions: {},
  context: ({req}: {req: Request}) => {
    return req;
  },
  // TODO: disable these in future
  introspection: true,
  playground: true,
  // This allows us to easily log errors but
  // replaces a lot of the useful error logic apollo-server already does
  // formatError,
  // @ts-ignore
  extensions: [
    () =>
      new OpentracingExtension({
        server: tracer,
        local: tracer,
        shouldTraceRequest: (_info: any) => {
          return true;
        },
      }),
  ],
});
apolloServer.applyMiddleware({app, path: '/graphql'});
const port = 5000;

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
);
