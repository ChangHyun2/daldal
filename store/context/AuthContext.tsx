import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSession, signIn as NextAuthSignIn } from "next-auth/react";

export type Member = {
  email: string;
  gender?: "male" | "female";
  id: string;
  loginType: "GOOGLE" | "NAVER" | "GITHUB";
  nickname?: string;
  username?: string;
};

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
    if (!session.data?.user) return;

    const { provider } = session.data as typeof session.data & {
      provider: Provider;
    };
    const { email } = session.data.user;

    if (!provider) return;

    fetch(
      `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:12333"
          : "https://daldal.k-net.kr"
      }/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginType: provider.toUpperCase(),
          email,
        }),
      }
    ).then(async (res) => {
      const {
        member,
        token: { accessToken },
      } = await res.json();

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
