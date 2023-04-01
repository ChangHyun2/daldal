import { Member } from "@/data/backend/member";
import axios from "axios";

// GET
export const getUser = (id: Pick<Member, "id">) => axios.get(`/user/${id}`);

// PATCH
export type PatchUserRequest = Pick<Member, "id"> & Partial<Member>;
export type PatchUserResponse = Member;

export const patchUser = (
  id: Pick<Member, "id">,
  patchUserRequest: PatchUserRequest
) => axios.patch<PatchUserResponse>(`/user/${id}`, patchUserRequest);
