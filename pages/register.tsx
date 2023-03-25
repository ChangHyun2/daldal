import { SignInRequest } from "@/api/auth";
import { useRegisterMutation } from "@/store/query/auth";
import { setupServer } from "msw/lib/node";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import s from "csd";

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInRequest>();
  const registerMutation = useRegisterMutation();

  const onSubmit = async (data: SignInRequest) => {
    try {
      // await registerMutation.mutateAsync(data);
      router.push("/signin");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StyledRegister>
      <h1>회원가입</h1>
      <h2>도율님 회원가입 api 만들어주세요~~~~</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
      >
        <input type="text" {...register("username")} />
        <input type="password" {...register("password")} />
        <button>회원가입</button>
      </form>
    </StyledRegister>
  );
}

const StyledRegister = styled.div`
  padding: 20px;
  ${s.colCenter}

  h2 {
    ${s.mb4}
  }

  form {
    ${s.colCenter}
  }
`;
