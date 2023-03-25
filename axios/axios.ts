import axios, { AxiosDefaults, AxiosHeaders, HeadersDefaults } from "axios";
import { access } from "fs";
import qs from "qs";

export const daldalAxios = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http:localhost:3000/api" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

daldalAxios.defaults.paramsSerializer = {
  serialize: (params) => qs.stringify(params),
};

export const setAccessToken = (accessToken: string) => {
  daldalAxios.defaults.headers.common = {
    ["Authorization"]: `Bearer ${accessToken}`,
  };
};
