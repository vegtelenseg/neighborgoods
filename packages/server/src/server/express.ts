import jwt from 'jsonwebtoken';
import express, {Response} from 'express';
import {ApolloServer} from 'apollo-server-express';
import OpentracingExtension from 'apollo-opentracing';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import schema from '../schema';
import tracer from '../tracer';
import {createContext} from '../util';
import {UserService} from '../services/UserService';
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from './constants';

const app = express();

app.use(bodyParser());
app.use(cors());
app.use(helmet());

const decodeCreds = (req: any) => {
  const authHeader = req.headers.authorization!;
  const encodedredentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(
    encodedredentials,
    'base64'
  ).toString();
  return decodedCredentials;
};

app.post('/login', async (req: any, res: Response) => {
  const decodedCredentials = decodeCreds(req);
  const [username, password] = decodedCredentials.split(':');
  const context = createContext(req);
  const credentials = {
    username,
    password,
  };
  const user = await UserService.findByUsernameAndPassword(
    context,
    credentials
  );
  if (user) {
    // TODO: Store these in .env;
    const accessToken = jwt.sign(
      {username: user.username, id: user.id},
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    const refreshTokenCount = user.resetCount + 1;
    const refreshToken = jwt.sign(
      {username: user.username, id: user.id, count: refreshTokenCount},
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );
    await UserService.updateResetCount(context, refreshTokenCount);
    res.send({
      refreshToken,
      accessToken,
    });
  } else {
    res.send('Username or password incorrect');
    return;
  }
});

app.post('/refreshToken', async (req, res) => {
  // @ts-ignore
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const [, token] = authHeader.split(' ');
    try {
      const decode = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
      const newAccessToken = jwt.sign(
        {id: decode.id, username: decode.username},
        ACCESS_TOKEN_SECRET
      );
      const newRefreshToken = jwt.sign(
        {
          id: decode.id,
          username: decode.username,
          count: decode.count + 1,
        },
        REFRESH_TOKEN_SECRET
      );
      // @ts-ignore
      req.user = {
        id: decode.id,
        username: decode.username,
      };
      const context = createContext(req);
      await UserService.updateResetCount(context, decode.count + 1);
      res.send({
        newAccessToken,
        newRefreshToken,
      });
    } catch (error) {
      res.redirect(401, '/login');
      console.log('Error Refreshing Token BE: ', error.message);
    }
  }
});
const apolloServer = new ApolloServer({
  schema,
  subscriptions: {},
  context: async ({
    req,
    res,
    connection,
  }: {
    req: any;
    res: Response;
    connection: any;
  }) => {
    if (connection) {
      return connection.context;
    } else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const [, token] = authHeader.split(' ');

      if (!token) {
        return {};
      }

      try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = {
          ...(decoded as object),
        };
        return createContext(req);
      } catch (error) {
        console.log('Token not good: ', error.message);
        // @ts-ignore
        const authHeader = req.headers['authorization'];
        if (authHeader) {
          const [, token] = authHeader.split(' ');
          try {
            const decode = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
            const newAccessToken = jwt.sign(
              {id: decode.id, username: decode.username},
              ACCESS_TOKEN_SECRET
            );
            const newRefreshToken = jwt.sign(
              {
                id: decode.id,
                username: decode.username,
                count: decode.count + 1,
              },
              REFRESH_TOKEN_SECRET
            );
            // @ts-ignore
            req.user = {
              id: decode.id,
              username: decode.username,
            };
            const context = createContext(req);
            await UserService.updateResetCount(context, decode.count + 1);
            res.send({
              newAccessToken,
              newRefreshToken,
            });
          } catch (error) {
            res.redirect(401, '/login');
            console.log('Error Refreshing Token BE: ', error.message);
          }
        }
        return res.status(401);
      }
    } else {
      req.user = {};
    }
    return createContext(req);
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
const httpServer = app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
);
apolloServer.installSubscriptionHandlers(httpServer);
