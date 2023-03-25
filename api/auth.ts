import { Token } from "@/data/backend/token";
import { User } from "@/data/backend/user";
import { daldalAxios } from "./axios";

// REGISTER
export type RegisterRequest = Pick<User, "username"> & { password: string };
export const register = (registerRequest: RegisterRequest) =>
  daldalAxios.post(`/resgiter`, registerRequest);

// SIGNIN
export type SignInRequest = RegisterRequest;
export type SignInResponse = {
  user: User;
} & Token;
export const signIn = (signInRequest: SignInRequest) =>
  daldalAxios.post<SignInResponse>("/signin", signInRequest);

// SIGNOUT
export const signOut = () => daldalAxios.post(`/signout`);
