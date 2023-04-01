import { QuizSharp } from "@mui/icons-material";
import axios from "axios";
import qs from "qs";

export const daldalAxios = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:12333/api/v1"
      : "https://daldal.k-net.kr/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => qs.stringify(params),
  },
});

export const setToken = (token: string | null) => {
  daldalAxios.defaults.headers["Authorization"] = token
    ? `Bearer ${token}`
    : null;
};
