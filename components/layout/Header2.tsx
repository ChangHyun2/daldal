import Link from "next/link";
import styled from "styled-components";
import s from "csd";

import { useAuthContext } from "@/store/context/AuthContext";
import { signIn, signOut } from "next-auth/react";

export default function Header2({ ...props }) {
  const { user, setUser, logout } = useAuthContext();

  return (
    <StyledHeader {...props}>
      <nav>
        <Link href="/">
          <img src="/icons/logo/nimble_logo_w.svg" width={106} height={21} />
        </Link>
        <ul>
          {user && (
            <>
              <li>
                <Link href="/courses/create">코스 그리기</Link>
              </li>
              <li>
                <Link href="/courses">나의 코스 모아보기</Link>
              </li>
              <li>
                <Link href="/reviews">코스 정보 둘러보기</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {user ? (
        <div>
          <span>{user.username || user.nickname}</span>
          <span style={{ marginRight: "8px" }}>{user.email}</span>
          {/* <IconButton style={{ color: "white" }}>
            <ArrowDropDownOutlined />
          </IconButton> */}
          <button className="auth-btn" onClick={logout}>
            로그아웃
          </button>
        </div>
      ) : (
        <button className="auth-btn" onClick={() => signIn()}>
          <div>로그인/회원가입</div>
        </button>
      )}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 80px;
  ${s.rowSpaceBetween}
  padding: 0 80px;
  background: #ff4546;
  color: #fff;
  margin-bottom: 80px;
  z-index: 1000;

  nav {
    ${s.row}

    img {
      margin-right: 64px;
    }

    .logo {
      width: 76px;
      height: 36px;
      margin-right: 64px;
      background: #d9d9d9;
    }

    ul {
      ${s.row};

      li {
        margin-right: 32px;

        a {
          font-size: 14px;
          line-height: 20px;
          font-weight: 600;
        }
      }
    }
  }

  .auth-btn {
    padding: 8px 16px;
    background: #ff4546;
    font-size: 12px;
    font-weight: 400;
    color: white;
    border-radius: 8px;
    border: none;

    &:hover {
      cursor: pointer;
      border: none;
      background: #eb0001;
    }
  }
`;
