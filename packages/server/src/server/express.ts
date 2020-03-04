import jwt from 'jsonwebtoken';
import {Request, NextFunction, Response} from 'express';
import {ApolloServer} from 'apollo-server-express';
import OpentracingExtension from 'apollo-opentracing';
import cors from 'cors';
import helmet from 'helmet';
import schema from '../schema';
import tracer from '../tracer';
import {createContext} from '../util';
import {UserService} from '../services/UserService';
import {User} from '../models';
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(helmet());

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secret', (err: any, user: any) => {
      if (err) {
        return res.json({message: 'Sorry. You are not logged in.'});
      }
      // @ts-ignore
      req.user = user;
      return next();
    });
  }
};

app.post('/graphql', authenticateJWT);
app.post('/login', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization!;
  const encodedredentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(
    encodedredentials,
    'base64'
  ).toString();
  const [username, password] = decodedCredentials.split(':');
  // @ts-ignore
  console.log('REQ.USER: ', req.user);
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
