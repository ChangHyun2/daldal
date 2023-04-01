import { AxiosResponse } from "axios";
import { daldalAxios } from "./instance";

export type SignOutResponse = AxiosResponse<{
  message: string;
  code: string;
  status: number;
}>;

export const signOut = () => daldalAxios.post<SignOutResponse>("/signout");
