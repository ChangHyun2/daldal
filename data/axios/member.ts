import { Member } from "../backend/member";
import { daldalAxios } from "./instance";

export const getMemberProfile = () =>
  daldalAxios.get<Member>("/member/profile");

export const putMemberProfile = (
  data: Pick<Member, "username" | "nickname" | "gender">
) => daldalAxios.put<Member>("/member/profile", { dto: { data } });
