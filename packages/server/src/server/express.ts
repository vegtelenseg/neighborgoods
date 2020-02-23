import jwt from 'jsonwebtoken';
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
const bodyParser = require('body-parser');
const express = require('express');

//const autoRegister = true;

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(helmet());

// @ts-ignore
const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secret', (err: any, user: any) => {
      if (err) {
        return res.json({message: 'Sorry. You are not logged in.'});
      }

      req.user = user;
      return next();
    });
  } else {
    console.log('No auth: ', authHeader);
    res.sendStatus(401);
  }
};
app.post('/graphql', authenticateJWT);

app.post('/login', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  const context = createContext(req);
  const accessTokenSecret = 'secret';
  const user = (await User.query().context(context)).find(
    (user) => user.username === username && user.password === password
  );
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

const apolloServer = new ApolloServer({
  schema,
  subscriptions: {},
  context: async ({req, connection}: {req: Request; connection: any}) => {
    const ctx = createContext(req);
    if (connection) {
      const {token} = connection.context;

      if (!token) {
        return {};
      }

      const decoded: any = jwt.verify(token, 'secret');
      const user = await UserService.findByUsername(ctx, decoded.username);
      console.log(JSON.stringify(user));
      return {user};
    } else {
      return ctx;
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
