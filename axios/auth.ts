import { Token } from "@/data/backend/token";
import { Member } from "@/data/backend/member";
import { daldalAxios } from "./axios";

// REGISTER
export type RegisterRequest = Pick<Member, "username"> & { password: string };
export const register = (registerRequest: RegisterRequest) =>
  daldalAxios.post(`/resgiter`, registerRequest);

// SIGNIN
export type SignInRequest = RegisterRequest;
export type SignInResponse = {
  user: Member;
} & Token;
export const signIn = (signInRequest: SignInRequest) =>
  daldalAxios.post<SignInResponse>("/signin", signInRequest);

// SIGNOUT
export const signOut = () => daldalAxios.post(`/signout`);
