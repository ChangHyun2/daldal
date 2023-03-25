import s from "csd";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuthContext } from "@/store/context/AuthContext";

export default function Header() {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  return (
    <Styledheader>
      <ul>
        <li>
          <button onClick={() => router.push("/")}>홈</button>
        </li>
        <li>
          {user ? (
            <button onClick={() => setUser(null)}>로그아웃</button>
          ) : (
            <button onClick={() => router.push("signin")}>로그인</button>
          )}
        </li>
        <li>
          <button onClick={() => router.push("/register")}>회원가입</button>
        </li>
        <li>
          <button onClick={() => router.push("/map")}>네이버 지도 보기</button>
        </li>
      </ul>
    </Styledheader>
  );
}

const Styledheader = styled.header`
  padding: 20px;
  ${s.rowEnd}

  ul {
    ${s.flex}
  }
`;
