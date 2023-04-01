import { daldalAxios } from "./instance";

export const bookmarkUp = (id: string) =>
  daldalAxios.post(`/bookmark/up/${id}`);
export const bookmarkDown = (id: string) =>
  daldalAxios.post(`/bookmark/down/${id}`);
