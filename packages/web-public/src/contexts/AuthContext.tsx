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
      refreshToken?: string;
    };

export interface AuthContextStateType {
  authContext: AuthContextType;
  handleLogin: (
    username: string,
    password: string
  ) => Promise<boolean | Response | void>;
  handleLogout: (logOutMessage?: string) => void;
}

export const AuthContext = createContext<AuthContextStateType>({
  authContext: {authenticated: false, refreshToken: ''},
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
  const [localStorageAuth, setLocalStorageAuth] = useLocalStorage<
    AuthContextType
  >('auth', {
    authenticated: false,
    refreshToken: '',
  });
  const [authContext, setAuthContext] = useState<AuthContextType>(() => {
    authTokenLoaded.current = true;
    return localStorageAuth;
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
        const newAuthContext: AuthContextType = {
          authenticated: true,
          token,
          refreshToken,
          username,
        };
        setLocalStorageAuth(newAuthContext);
        setAuthContext(newAuthContext);
        return result;
      } else {
        return result;
      }
      // TODO handle timeout
    },
    [setLocalStorageAuth]
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
      if (authContext.authenticated === true) {
        setAuthContext({
          authenticated: false,
          refreshToken: authContext.refreshToken,
        });
        localStorage.removeItem('auth');
        // alert(message);
        setLogoutMessage('You have been logged out');
      }
    },
    [authContext.authenticated]
  );

  useEffect(() => {
    if (loggingOut) {
      //** Calls callback with dependencies on authContext and
      //* history so that the useEffect don't fire on those dependencies
      //**
      doLogout(logOutMessage);
      setLoggingOut(false);
    }
  }, [loggingOut, doLogout, logOutMessage]);

  useEffect(() => {
    const authString = localStorage.getItem('auth') as string;
    const localStorageAuth = JSON.parse(authString);
    let authContext: AuthContextType = {authenticated: false};
    if (
      localStorageAuth !== null
      // TODO: Localize expiry
    ) {
      authContext = {
        authenticated: localStorageAuth.authenticated,
        token: localStorageAuth.token,
        refreshToken: localStorageAuth.refreshToken,
        username: localStorageAuth.username,
      };
      setAuthContext(authContext);
    }
  }, []);

  // Prevent double render before authContext token loaded
  if (!authTokenLoaded.current) {
    return null;
  }

  return (
    <AuthContext.Provider value={{authContext, handleLogin, handleLogout}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export const useAuthContextProvider = () => useContext(AuthContext);
