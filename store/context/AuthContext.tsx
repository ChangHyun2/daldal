import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import jwt_decode from "jwt-decode";

import { signIn as NextLogin, signOut as NextLogout } from "next-auth/react";
import { Member } from "@/data/backend/member";
import { LoginRequest, LoginType, nextLogin } from "@/data/axios/login";
import { setToken } from "@/data/axios/instance";
import { nextReissue } from "@/data/axios/reissue";
import { getMemberProfile } from "@/data/axios/member";

type AuthContextType = {
  user: Member | null;
  setUser: Dispatch<SetStateAction<Member | null>>;
  oauth: (provider: LoginType) => void;
  logout: () => void;
  login: (loginRequest: LoginRequest) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const ACCESS_TOKEN_KEY_DO_DELETE = "delete when fix reissue api";
const REFRESH_TOKEN_KEY = "asdfasdfadsfasfadsfasfwerq";

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<Member | null>(null);

  const oauth = (provider: LoginType) => {
    NextLogin(provider);
    // 로그인 페이지로 이동됨
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    NextLogout();
  };

  const login = async (loginRequest: LoginRequest) => {
    const { data } = await nextLogin(loginRequest);

    if (data) {
      const {
        member,
        token: { accessToken, refreshToken },
      } = data;

      // window.localStorage.setItem(ACCESS_TOKEN_KEY_DO_DELETE, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setToken(accessToken);
      setUser(member);
      return;
    }

    window.alert("로그인 실패");
  };

  const autoLogin = async () => {
    // const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY_DO_DELETE);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      console.log("auto login start");
      const { exp } = jwt_decode(refreshToken) as { exp: number };
      const current = new Date().getTime();
      const isExpired = exp * 1000 < current;

      if (!isExpired) {
        const { data } = await nextReissue({ refreshToken });
        if (data) {
          const {
            token: { accessToken, refreshToken },
            member,
          } = data;

          setUser(member);
          setToken(accessToken);
          window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

          console.log("auto login success");
        }
      }
    }

    // if (accessToken) {
    //   const { exp } = jwt_decode(accessToken) as { exp: number };
    //   const current = new Date().getTime();
    //   const isExpired = exp * 1000 < current;

    //   console.log(accessToken);
    //   if (isExpired) return;
    //   setToken(accessToken);
    //   const { data } = await getMemberProfile();
    //   if (data) setUser(data);
    //   return;
    // }

    console.log("auto login failure");
  };

  // 앱 진입 시 local storage 확인 (자동 로그인)
  useEffect(() => {
    // autoLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, oauth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("AuthContext must be used in AuthContextProvider");
  }

  return authContext;
};
