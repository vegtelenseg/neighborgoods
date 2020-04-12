import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

export interface AuthContextImageType {
  id: string;
  uri: string;
  title: string;
  altText: string;
}

export type AuthContextType =
  | {
      token: string;
      refreshToken: string;
      authenticated: true;
      username: string;
      profilePic?: AuthContextImageType;
    }
  | {
      authenticated: false;
    };

export interface AuthContextStateType {
  auth: AuthContextType;
  handleLogin: (
    username: string,
    password: string
  ) => Promise<boolean | Response | void>;
  handleLogout: (logOutMessage?: string) => void;
}

export const AuthContext = createContext<AuthContextStateType>({
  auth: {authenticated: false},
  handleLogin: async () => {},
  handleLogout: () => {},
});

const serverUri = 'http://localhost:5000';

interface Props {
  children: JSX.Element;
}
export function AuthContextProvider({children}: Props) {
  const [loggingOut, setLoggingOut] = useState(false);
  const authTokenLoaded = React.useRef<boolean>(false);
  const [logOutMessage, setLogoutMessage] = useState(
    'You have been logged out'
  );
  const [localAuth, setLocalAuth] = useLocalStorage<AuthContextType>('auth', {
    authenticated: false,
  });
  const [auth, setAuth] = useState<AuthContextType>(() => {
    authTokenLoaded.current = true;
    return localAuth;
  });
  const handleLogin = React.useCallback(
    async function(username: string, password: string) {
      setLoggingOut(false);

      const body = new URLSearchParams();
      body.set('grant_type', 'client_credentials');

      // TODO: Only throws if the server cant be reached
      const result = await fetch(`${serverUri}/login`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST',
        body,
      });

      if (result.ok) {
        const responseObject = await result.json();
        const token = responseObject.accessToken;
        const refreshToken = responseObject.refreshToken;
        const newAuth: AuthContextType = {
          authenticated: true,
          token,
          refreshToken,
          username,
        };
        setLocalAuth(newAuth);
        setAuth(newAuth);
        return result;
      } else {
        return result;
      }
      // TODO handle timeout
    },
    [setLocalAuth]
  );

  async function handleLogout(logOutMessage?: string) {
    //** sCalls useEffects
    //* with logout as dependency for ONLY Logout
    //* as the callback for the state update on is logging out
    //**
    if (logOutMessage) {
      setLogoutMessage(logOutMessage);
      setLoggingOut(true);
    } else {
      setLoggingOut(true);
    }
  }
  const doLogout = useCallback(
    (message: string) => {
      if (auth.authenticated === true) {
        setAuth({authenticated: false});
        localStorage.removeItem('auth');
        // alert(message);
        setLogoutMessage('You have been logged out');
      }
    },
    [auth.authenticated]
  );

  useEffect(() => {
    if (loggingOut) {
      //** Calls callback with dependencies on auth and
      //* history so that the useEffect don't fire on those dependencies
      //**
      doLogout(logOutMessage);
      setLoggingOut(false);
    }
  }, [loggingOut, doLogout, logOutMessage]);

  useEffect(() => {
    const authString = localStorage.getItem('auth') as string;
    const localAuth = JSON.parse(authString);
    let auth: AuthContextType = {authenticated: false};
    if (
      localAuth !== null
      // TODO: Localize expiry
    ) {
      auth = {
        authenticated: localAuth.authenticated,
        token: localAuth.token,
        refreshToken: localAuth.refreshToken,
        username: localAuth.username,
      };
      setAuth(auth);
    }
  }, []);

  // Prevent double render before auth token loaded
  if (!authTokenLoaded.current) {
    return null;
  }

  return (
    <AuthContext.Provider value={{auth, handleLogin, handleLogout}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export const useAuthContextProvider = () => useContext(AuthContext);