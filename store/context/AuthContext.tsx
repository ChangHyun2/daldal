import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSession, signIn as NextAuthSignIn } from "next-auth/react";
import { Member } from "@/data/backend/member";
import axios from "axios";
import { daldalAxios, setAccessToken } from "@/axios/axios";
import { LoginType, login } from "@/data/axios/login";
import { setToken } from "@/data/axios/instance";

type Provider = "google" | "naver" | "github";
type AuthContextType = {
  user: Member | null;
  setUser: Dispatch<SetStateAction<Member | null>>;
  signIn: (provider: Provider) => void;
  setProvider: Dispatch<SetStateAction<Provider | null>>;
  provider: Provider | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<Member | null>(null);
  const session = useSession();
  const [provider, setProvider] = useState<Provider | null>(null);

  const signIn = (provider: Provider) => {
    setProvider(provider);
    NextAuthSignIn(provider);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token") as string | null;
    const user = window.localStorage.getItem("user");

    if (token && user) {
      console.log({ token, user });
      setToken(token);
      setUser(JSON.parse(user));
      return;
    }

    if (!session.data?.user) return;

    const { provider } = session.data as typeof session.data & {
      provider: LoginType;
    };
    const { email } = session.data.user;

    if (!provider) return;
    if (!email) return;

    login({
      loginType: provider.toUpperCase() as LoginType,
      email,
    }).then(async ({ data }) => {
      if (!data) window.alert("로그인 실패");

      const {
        member,
        token: { accessToken },
      } = data;

      window.localStorage.setItem("token", accessToken);
      window.localStorage.setItem("user", JSON.stringify(member));
      setToken(accessToken);
      setUser(member);

      console.log("set axios accessToken", accessToken);
    });
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, setProvider, provider, signIn }}
    >
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
