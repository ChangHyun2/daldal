import { SignInRequest } from "@/api/auth";
import { useAuthContext } from "@/store/context/AuthContext";
import { useSignInMutation } from "@/store/query/auth";
import { useSession, signIn, signOut } from "next-auth/react";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import s from "csd";

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequest>();

  const session = useSession();
  console.log({ session });
  const { user, setUser } = useAuthContext();
  const signInMutation = useSignInMutation();

  const onSubmit = async (data: SignInRequest) => {
    try {
      console.log("onsubmit");
      signIn();

      console.log(data);

      // await signInMutation.mutateAsync(data);
      // setUser({
      //   id: "1",
      //   username: data.username,
      // });
      // router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      // router.push("/");
    }
  }, [user]);

  if (user) {
    return null;
  }

  return (
    <StyledSignIn>
      <h1>로그인</h1>
      <h2>도율님 로그인 api 만들어주세요~~~~</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          handleSubmit(onSubmit)();
        }}
      >
        <input type="text" {...register("username")} />
        <input type="password" {...register("password")} />
        <button>로그인</button>
      </form>
    </StyledSignIn>
  );
}

const StyledSignIn = styled.div`
  padding: 20px;
  ${s.colCenter}

  h2 {
    ${s.mb4}
  }

  form {
    ${s.colCenter}
  }
`;
