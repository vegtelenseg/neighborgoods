const express = require('express');
import jwt from 'jsonwebtoken';
const bodyParser = require('body-parser');
import {Request, NextFunction, Response} from 'express';
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
// import Context from '../context';
import {createContext} from '../util';
import {User} from '../models';
import {UserService} from '../services/UserService';

//const autoRegister = true;

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(helmet());

const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secret', (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      return next();
    });
  } else {
    res.sendStatus(401);
  }
};
app.use('/graphql', authenticateJWT);

// @ts-ignore
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const context = createContext(req);
  const accessTokenSecret = 'secret';
  const user = (await User.query().context(context)).find(
    (user) => user.username === username && user.password === password
  );
  console.log('USER: ', user);
  if (user) {
    const accessToken = jwt.sign(
      {username: user.username, id: user.id},
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send('Username or password incorrect');
  }
});

// export function createContext(req: Request): Context {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   let span = (req as any).span;

//   if (span == null) {
//     span = tracer.startSpan('UNKNOWN');
//   }

//   return {
//     span,
//     // @ts-ignore
//     user: req.user,
//     req,
//     startSpan,
//   };
// }

const apolloServer = new ApolloServer({
  schema,
  subscriptions: {},
  context: async ({req, connection}: {req: Request; connection: any}) => {
    if (connection) {
      const {token} = connection.context;
      console.log('DECODED: ', token);

      if (!token) {
        return {};
      }

      const decoded: any = jwt.verify(token, 'secret');
      const user = await UserService.findByUsername(
        createContext(req),
        decoded.username
      );
      console.log(JSON.stringify(user));
      return {user};
    } else {
      // User already authenticated previously
      return req;
    }
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
apolloServer.applyMiddleware({app, path: '/graphql', bodyParserConfig: true});
const port = 5000;

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
);
