import { AxiosResponse } from "axios";

import { Token } from "../backend/token";
import { Member } from "../backend/member";
import { daldalAxios } from "./instance";

export type LoginType = "GOOGLE" | "NAVER" | "GITHUB";

export type LoginRequest = {
  email: string;
  loginType: LoginType;
};

export type LoginResponse = {
  token: Token;
  member: Member;
};

export const login = (loginRequest: LoginRequest) =>
  daldalAxios.post<LoginResponse>("/auth/login", loginRequest);
