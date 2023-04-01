import { daldalAxios } from "./instance";

export const logout = () => daldalAxios.post("/logout");
