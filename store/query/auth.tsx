import {
  RegisterRequest,
  SignInRequest,
  register,
  signIn,
  signOut,
} from "@/api/auth";

import { useMutation } from "@tanstack/react-query";

// REGISTER
export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (registerRequest: RegisterRequest) => register(registerRequest),
  });

// SIGNIN
export const useSignInMutation = () =>
  useMutation({
    mutationFn: (signInRequest: SignInRequest) => signIn(signInRequest),
  });

// SIGNOUT

export const useSignOutMutation = () =>
  useMutation({
    mutationFn: () => signOut(),
  });
