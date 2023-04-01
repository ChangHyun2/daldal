import { AxiosResponse } from "axios";
import { daldalAxios } from "./instance";
import { Token } from "../backend/token";

export type ReissueResponse = AxiosResponse<Token>;

export const reissuse = () => daldalAxios.post("/reissue");
