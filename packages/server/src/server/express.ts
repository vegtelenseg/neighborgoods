import jwt from 'jsonwebtoken';
import express, {NextFunction, Response} from 'express';
import {ApolloServer} from 'apollo-server-express';
import OpentracingExtension from 'apollo-opentracing';
import cors from 'cors';
import helmet from 'helmet';
import io from 'socket.io';
import http from 'http';
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
const server = http.createServer(app);

// @ts-ignore
const authenticateJWT = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    // TODO:  First check if refreshtoken is valid.
    // If valid then continue with code below, otherwise
    // Send them login page.
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
      if (err) {
        return res.json({
          message: 'Sorry. You are not logged in. ' + err.message,
        });
      }
      // @ts-ignore
      req.user = {
        username: user.username,
        id: user.id,
      };
      return next();
    });
  }
};

const socket = io(server);
socket.on('connection', function(socket) {
  console.log('a user connected: ', socket.id);
});

// app.use('/graphql', authenticateJWT)
const decodeCreds = (token: string) => {
  const encodedredentials = token.split(' ')[1];
  const decodedCredentials = Buffer.from(
    encodedredentials,
    'base64'
  ).toString();
  return decodedCredentials;
};

app.post('/login', async (req: any, res: Response) => {
  const authHeader = req.headers.authorization!;
  const decodedCredentials = decodeCreds(authHeader);
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
    const accessTokenSecret = ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = REFRESH_TOKEN_SECRET;
    const accessToken = jwt.sign(
      {username: user.username, id: user.id},
      accessTokenSecret,
      {
        expiresIn: '1d',
      }
    );
    const refreshTokenCount = user.resetCount + 1;
    const refreshToken = jwt.sign(
      {username: user.username, id: user.id, count: refreshTokenCount},
      refreshTokenSecret,
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

app.post('/refreshToken', async (req: any, res: any, next: NextFunction) => {
  if (req.body && req.body.refreshToken) {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      next();
    }

    try {
      const decoded = jwt.decode(refreshToken) as {
        [key: string]: any;
      };
      if (decoded) {
        req.user = {
          // @ts-ignore
          id: decoded['id'],
          // @ts-ignore
          username: decoded['username'],
        };
      }
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const context = createContext(req);
      const user = await UserService.findByUsername(
        context,
        decoded['username']
      );
      // @ts-ignore
      if (user && user.resetCount === decoded.count) {
        const newAccessToken = jwt.sign(
          {id: user.id, username: user.username},
          ACCESS_TOKEN_SECRET
        );
        const newRefreshToken = jwt.sign(
          {id: user.id, username: user.username, count: user.resetCount + 1},
          REFRESH_TOKEN_SECRET
        );
        res.send({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    } catch (error) {
      res.status(401);
      next();
      console.log('Token not good: ', error.message);
    }
  }
});
const apolloServer = new ApolloServer({
  schema,
  subscriptions: {},
  context: async ({req, res}: {req: any; res: Response}) => {
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const [, token] = authHeader.split(' ');

      if (!token) {
        return {};
      }

      try {
        const decoded = jwt.decode(token);
        if (decoded) {
          req.user = {
            // @ts-ignore
            id: decoded.id,
            // @ts-ignore
            username: decoded.username,
          };
        }
        jwt.verify(token, ACCESS_TOKEN_SECRET);
        socket.emit('message', {
          message: 'Yea',
        });
      } catch (error) {
        res.status(401);

        console.log('Token not good: ', error.message);
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
server.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
);
