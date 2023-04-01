import { useAuthContext } from "@/store/context/AuthContext";
import styled from "styled-components";
import s from "csd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useNaverMapContext } from "@/store/context/NaverMap";
import Header2 from "@/components/layout/Header2";
import { getReviewPopular } from "@/data/axios/review/popular";
import { FEATURES, Review } from "@/data/axios/review";
import { userAgent } from "next/server";
import NaverMap from "@/components/map/naverMap";
import { bookmarkDown, bookmarkUp } from "@/data/axios/bookmark";
import { useRouter } from "next/router";
import { r } from "msw/lib/glossary-de6278a9";
import { favouriteDown, favouriteUp } from "@/data/axios/favourite";
import { signIn } from "next-auth/react";
import { login } from "@/data/axios/login";
import axios from "axios";
import qs from "qs";

export default function Home({ reviews }: { reviews: Review[] }) {
  const { user } = useAuthContext();

  return (
    <StyledHome>
      <StyledHeader />
      <div className="background"></div>
      <StyledMain style={{ position: "relative" }}>
        {/* <StyledSvg>
          <svg
            width="100vw"
            height="415px"
            viewBox="0 0 100vw 415px"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1080 -109H0V269H0.00153437C0.000511647 269.167 0 269.333 0 269.5C0 384.099 241.766 477 540 477C838.234 477 1080 384.099 1080 269.5C1080 269.333 1080 269.167 1080 269H1080V-109Z"
                fill="#0F186C"
              />
            </g>
          </svg>
        </StyledSvg> */}
        <h1>
          <span className="h1-1">당신의 인생에도, </span>
          <br />
          <span className="h1-2">
            당신의 <strong>러닝</strong>에도
            <strong>
              <span className="variable">
                변수
                <img src="/Rectangle 60.svg" />
              </span>
              가 없도록
            </strong>
          </span>
        </h1>
        {reviews && <Reviews reviews={reviews} />}
      </StyledMain>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  position: relative;

  .background {
    margin-top: 80px;
    z-index: -1;
    position: fixed;
    top: 0;
    width: 100%;
    height: 888px;

    background: linear-gradient(
      180deg,
      #0f186c 0%,
      #4c2361 14.58%,
      #0f186c 36.98%,
      #090f43 100%
    );
  }

  letter-spacing: -0.027em;

  strong {
    font-family: "Gmarket Sans Bold";
  }

  .variable {
    position: relative;

    img {
      z-index: -1;
      position: absolute;
      left: -12px;
      top: -18px;
    }
  }
`;

const StyledHeader = styled(Header2)`
  background: #0f186c;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0, 0, 0, 0.1);
`;

const StyledMain = styled.main`
  margin-top: 160px;

  h1 {
    font-family: "Gmarket Sans";
    font-style: normal;
    font-weight: 300;
    font-size: 36px;
    line-height: 52px;
    letter-spacing: -0.027em;
    text-align: center;
    display: span;
    position: relative;
    color: #fff;
    font-size: 36px;
    line-height: 52px;
    font-weight: 700;
    margin: 0 auto;
    margin-bottom: 60px;
  }
`;

function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <StyledReviews>
      {reviews.map((r) => (
        <ReviewItem review={r} key={r.id} />
      ))}
    </StyledReviews>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    review.isBookmarked
  );

  const { user } = useAuthContext();

  const [isFavourite, setIsFavorite] = useState<boolean>(review.isFavorite);
  const router = useRouter();

  const favoriteOthers = Math.min(review.favourite + (isFavourite ? -1 : 0), 0);
  const bookmarkOthers = Math.min(
    review.course.bookamark + (isBookmarked ? -1 : 0),
    0
  );

  return (
    <li>
      <div className="top">
        <div className="top-left">
          <img className="avatar" src={review.imageUrl} />
          <div>
            <b>
              {review.member.nickname || review.member.username || "홍길동"}
            </b>
            님
          </div>
        </div>
        <div>4시간 전</div>
      </div>
      <div className="diary">
        <p>{review.content}</p>
        <div className="sentiment">
          <span className="emoji">😎</span>
          <span>{review.sentiment}</span>
        </div>
      </div>
      <ul className="body">
        <li>
          <img className="img" src={review.imageUrl} />
        </li>
        <li className="navermap">
          <NaverMap coursePoints={review.course.points} disabled />
          <div className="address">
            <img src="/icons/pin_drop.svg" />

            <span>{review.course.name || "봉천동"}</span>
          </div>
        </li>
      </ul>
      <div className="footer">
        <ul className="features">
          {review.features.map((feature) => (
            <li key={feature}>
              <Image
                width={24}
                height={24}
                src={`/icons/${
                  FEATURES.find((f) => f.name === feature)?.icon
                }.svg`}
                alt="acute"
              />
            </li>
          ))}
        </ul>
        {user && (
          <StyledActions>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite((prev) => !prev);
                isFavourite ? favouriteDown(review.id) : favouriteUp(review.id);
              }}
            >
              <span>
                <img
                  src={`/icons/${
                    isFavourite ? "favorite_filled" : "favorite_outline"
                  }.svg`}
                />
              </span>
              <span>{favoriteOthers + (isFavourite ? 1 : 0)}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked((prev) => !prev);
                isBookmarked
                  ? bookmarkUp(review.course.id)
                  : bookmarkDown(review.course.id);
              }}
            >
              <span>
                <img
                  src={`/icons/Bookmark_${
                    isBookmarked ? "filled" : "outline"
                  }.svg`}
                />
              </span>
              <span>{bookmarkOthers + (isBookmarked ? 1 : 0)}</span>
            </button>
          </StyledActions>
        )}
      </div>
    </li>
  );
}

const StyledReviews = styled.ul`
  > li {
    padding: 24px;
    width: 608px;
    margin: 0 auto;
    ${s.mb5}
    background: #FAFAFA;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 8px;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .top-left {
        ${s.rowCenter}
        font-size: 16px;

        .avatar {
          border-radius: 100%;
          width: 32px;
          height: 32px;
          background: white;
          margin-right: 16px;
        }
      }

      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.025em;
      color: #616161;
    }

    .diary {
      ${s.row}
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      margin-bottom: 8px;

      p {
        flex: 1;
      }

      .sentiment {
        padding: 4px 8px;
        background: #e9eafc;
        border: 1px solid #7884ed;
        border-radius: 8px;
        font-weight: 400;
        font-size: 11px;
        line-height: 14px;
        letter-spacing: 0.031em;
        color: #9ca5f2;

        .emoji {
          margin-right: 5px;
        }
      }
    }

    .body {
      ${s.row}
      margin-bottom: 4px;

      li {
        ${s.grid6}

        .img {
          width: 100%;
          height: 296px;
          background: #eee;
        }
      }

      .navermap {
        ${s.colEnd}
        position:relative;

        .map {
          width: 100%;
          height: 296px;
        }

        .address {
          ${s.rowCenter}
          position: absolute;
          left: 50%;
          transform: translate(-50%, -16px);
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;

          img {
            margin-right: 4px;
          }
          span {
            margin-top: -2px;
          }
        }
      }
    }

    .footer {
      ${s.rowSpaceBetween};
      align-items: center;

      .features {
        ${s.row}

        li {
          margin-right: 12px;
        }
      }

      .review {
        ${s.row};
        align-items: start;
        flex-wrap: nowrap;

        .badge {
          ${s.rowCenter};
          padding: 4px 8px;
          border: 1px solid #7884ed;
          border-radius: 8px;

          font-size: 11px;
          line-height: 14px;
        }
      }
    }
  }
`;

const StyledActions = styled.div`
  ${s.row}

  button {
    ${s.row};
    padding: 11px 18px;
    background: none;
    border: none;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.0145em;
    color: #ff4546;
    cursor: pointer;
    padding: 8px 16px;

    &:first-of-type {
      margin-right: 8px;
    }

    &:hover {
      background: #fff5f5;
    }

    img {
      ${s.rowCenter}
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }
`;

export async function getStaticProps() {
  const daldalAxios = axios.create({
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:12333/api/v1"
        : "https://daldal.k-net.kr/",
    headers: {
      "Content-Type": "application/json",
    },
    paramsSerializer: {
      serialize: (params) => qs.stringify(params),
    },
  });

  const setToken = (token: string | null) => {
    daldalAxios.defaults.headers["Authorization"] = token
      ? `Bearer ${token}`
      : null;
  };

  const { data } = await daldalAxios.post("/login", {
    email: "jchangh2@gmail.com",
    loginType: "GOOGLE",
  });

  if (!data) return { reviews: [] };
  const { token } = data;
  setToken(token.accessToken);

  const {
    data: { content },
  } = await daldalAxios.post(
    "/review/filter",
    { features: [] },
    {
      params: {
        page: 0,
        size: 100,
      },
    }
  );

  return {
    props: { reviews: content }, // will be passed to the page component as props
  };
}
