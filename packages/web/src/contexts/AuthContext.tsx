import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface AuthContextImageType {
  id: string;
  uri: string;
  title: string;
  altText: string;
}

export type AuthContextType =
  | {
      token: string;
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
  updateImage: (image: AuthContextImageType) => void;
}

export const AuthContext = createContext<AuthContextStateType>({
  auth: {authenticated: false},
  handleLogin: async () => {},
  handleLogout: () => {},
  updateImage: () => {},
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

  const [auth, setAuth] = useState<AuthContextType>(() => {
    let finalResponse: AuthContextType = {authenticated: false};
    try {
      const data = localStorage.getItem('auth');
      if (data) {
        finalResponse = JSON.parse(data) as AuthContextType;
      }
    } catch (ex) {
      // ignore auth
    } finally {
      authTokenLoaded.current = true;
    }
    return finalResponse;
  });

  async function handleLogin(
    username: string,
    password: string,
    message?: string
  ) {
    setLoggingOut(false);
    console.log('TRYING TO LOGIN');
    const body = {
      username,
      password,
    };

    // TODO: Handle login
    const result = await fetch('');

    if (result.ok) {
      const responseObject = await result.json();
      const token = responseObject.access_token;
      const newAuth: AuthContextType = {authenticated: true, token, username};
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));

      return true;
    } else {
      return result;
    }
    // TODO handle timeout
  }

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

  function updateImage(image: AuthContextImageType) {
    if (auth.authenticated) setAuth({profilePic: image, ...auth});
    localStorage.setItem('auth', JSON.stringify({profilePic: image, ...auth}));
  }

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
        username: localAuth.username,
        profilePic: localAuth.profilePic,
      };
      setAuth(auth);
    }
  }, []);

  // Prevent double render before auth token loaded
  if (!authTokenLoaded.current) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{auth, handleLogin, handleLogout, updateImage}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export const useAuthContextProvider = () => useContext(AuthContext);
