export type Member = {
  id: string;
  loginType: "GOOGLE" | "NAVER" | "GITHUB";
  email: string;
  profileImageUrl?: string;
  username?: string;
  nickname?: string;
  gender?: "MALE" | "FEMALE";
};

export const MOCK_USER: Member = {
  id: "64244354c5c607173200afc6",
  loginType: "GOOGLE",
  email: "test@email.com",
};
