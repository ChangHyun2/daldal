import { User } from "@/data/backend/member";
import axios from "axios";

// GET
export const getUser = (id: Pick<User, "id">) => axios.get(`/user/${id}`);

// PATCH
export type PatchUserRequest = Pick<User, "id"> & Partial<User>;
export type PatchUserResponse = User;

export const patchUser = (
  id: Pick<User, "id">,
  patchUserRequest: PatchUserRequest
) => axios.patch<PatchUserResponse>(`/user/${id}`, patchUserRequest);
