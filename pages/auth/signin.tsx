import { useSession, signIn } from "next-auth/react";

import styled from "styled-components";
import s from "csd";
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useAuthContext } from "@/store/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginType } from "@/data/axios/login";

export default function Signin() {
  const { user, login, bsideLogin } = useAuthContext();
  const router = useRouter();
  const session = useSession();

  // session에 인증 확인되면 로그인 시도
  useEffect(() => {
    if (!session || !session.data) return;

    const { provider, user } = session.data as typeof session.data & {
      provider: LoginType;
    };

    if (!user || !provider || !user.email) {
      return;
    }

    login({
      loginType: provider,
      email: user.email,
    });
  }, [session]);

  // 로그인 되면 홈 페이지로 이동
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleClickBsideLogin = () => {
    bsideLogin();
  };

  return (
    <StyledSignIn>
      <div className="box">
        <IconButton className="close">
          <CloseOutlined />
        </IconButton>
        <h1>간편 로그인</h1>
        <div className="buttons">
          {/* <button
            className="naver"
            onClick={() => signIn("naver")}
            disabled={true}
          >
            <span>
              <img src="/icons/naver.svg" width={24} height={24} />
            </span>
            <span>네이버로 로그인</span>
          </button> */}
          <button className="google" onClick={() => signIn("google")}>
            <span>
              <img src="/icons/google.svg" width={24} height={24} />
            </span>
            <span>구글로 로그인</span>
          </button>
          <button className="bside" onClick={handleClickBsideLogin}>
            <div></div>
            <span>비사이드 전용 간편 로그인</span>
          </button>
        </div>
      </div>
    </StyledSignIn>
  );
}

const StyledSignIn = styled.div`
  height: 100vh;
  ${s.rowCenter};
  background: #616161;

  .box {
    padding: 20px 38px 44px 38px;
    background: #ffffff;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
    border-radius: 36px;

    .close {
      font-size: 20px;
      float: right;
    }

    h1 {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      clear: both;
      ${s.mb4}
    }

    .buttons {
      ${s.col}

      button {
        width: 244px;
        padding: 10px 24px 10px 40px;
        color: #fff;
        border: none;
        cursor: pointer;
        ${s.rowSpaceBetween}
        font-size: 14px;
        height: 47px;

        &.naver {
          ${s.mb1}
          background: #57B04B;
        }
        &.google {
          ${s.mb1}
          background: #4868ad;
        }
        &.bside {
          background: #ff4938;
        }
      }
    }
  }
`;
