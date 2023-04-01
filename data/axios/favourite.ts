import { daldalAxios } from "./instance";

export const favouriteUp = (id: string) =>
  daldalAxios.post(`/favourite/up/${id}`);
export const favouriteDown = (id: string) =>
  daldalAxios.post(`/favourite/down/${id}`);
