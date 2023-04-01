import { AxiosResponse } from "axios";
import { daldalAxios, nextAxios } from "./instance";
import { Token } from "../backend/token";
import { Member } from "../backend/member";

export type ReissueRequest = { refreshToken: string };
export type ReissueResponse = {
  token: Token;
  member: Member;
};

export const reissuse = (reissueRequest: ReissueRequest) =>
  daldalAxios.post<ReissueResponse>("/reissue", reissueRequest);

export const nextReissue = (reissueRequest: ReissueRequest) =>
  nextAxios.post<ReissueResponse>("/reissue", reissueRequest);
