import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import s from "csd";
import { FEATURES, Review, getReview } from "@/data/axios/review";
import NaverMap from "@/components/map/naverMap";
import { useAuthContext } from "@/store/context/AuthContext";
import Header2 from "@/components/layout/Header2";

export default function ReviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [review, setReview] = useState<Review | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthContext();
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    if (typeof id !== "string") return;

    getReview(id).then(({ data }) => {
      if (data) {
        setReview({ ...data, features: FEATURES.map((f) => f.name) });
        setIsFavorite(data.isFavorite);
        setIsBookmarked(data.isBookmarked);
      } else {
        router.push("/reviews");
      }
    });
  }, [id]);

  if (review === null) {
    return null;
  }

  const isMyReview = review?.member.email === user?.email;

  return (
    <StyledReviewDetail>
      <Header2 />
      <div className="header">
        <div className="header-left">
          <h1>
            {review.course.name || "서울시 송파구 잠실동 서울시 광진구 자양동"}
          </h1>
          <span>data</span>
        </div>
        <StyledActions>
          <div>
            <span>
              <img src={"/icons/favorite_filled.svg"} />
            </span>
            <span>{(review.favourite || 0) + (isFavorite ? 1 : 0)}</span>
          </div>
          <div>
            <span>
              <img src={`/icons/Bookmark_filled.svg`} />
            </span>
            <span>
              {(review.course.bookamark || 0) + (isBookmarked ? 1 : 0)}
            </span>
          </div>
        </StyledActions>
      </div>
      <div className="body">
        <div className="left">
          <div className="estimate">
            <div className="dist">
              <div className="label">거리</div>
              <div>{review.course.distance}</div>
            </div>
            <div className="time">
              <div className="label">예상 시간</div>
              <div>{review.course.duration}</div>
            </div>
          </div>
          <div>
            <ul className="features">
              {review.features.map((feature) => {
                const f = FEATURES.find((f) => f.name === feature);

                return (
                  <li key={feature}>
                    <img
                      src={`/icons/feature_large_red/${f?.icon || ""}.svg`}
                    />
                    <div>{f ? `${f.label}이 있어요.` : ""}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="diary">
            <h3>한줄 일기</h3>
            <img src={review.imageUrl} />
            <div className="content">{review.content}</div>
          </div>
        </div>
        <div className="right">
          <NaverMap coursePoints={review.course.points} disabled />
          <h3>댓글</h3>
          {!isMyReview && (
            <div className="comments-create">
              <img src={"/icons/cafe.svg"} />
              <input
                placeholder="댓글을 남겨주세요"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <button>게시</button>
            </div>
          )}
          <ul className="comments">
            {[1, 1, 2, 3, 1, 2].map((c, i) => (
              <li key={i}>
                <img src={"/icons/cafe.svg"} />
                <div>
                  <div className="name">
                    <div>{"ㅁㅇㄴㄹ"}</div>
                    <span>{"줗ㄴㅇ"}</span>
                  </div>
                  <p>{"뛰기 좋아요"}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StyledReviewDetail>
  );
}

const StyledReviewDetail = styled.div`
  padding: 32px 80px;

  .header {
    margin-top: 80px;
    ${s.rowSpaceBetween}
    margin-bottom:4px;

    h1 {
      margin-right: 16px;
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      letter-spacing: -0.023em;
      color: #ff4546;
    }

    span {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #bdbdbd;
    }
  }
  .header-left {
    ${s.row}
    margin-right: 48px;
  }

  .body {
    ${s.row}
    align-items:flex-start;

    .left {
      ${s.grid4}
      padding-right:42px;
    }
    .right {
      ${s.grid8}
    }

    .estimate {
      padding: 32px;
      border-bottom: 1px solid #eeeeee;
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      color: #222222;

      .dist {
        ${s.row};
      }

      .time {
        ${s.row}
      }
      .label {
        width: 90px;
      }
    }

    .features {
      padding: 32px 8px;
      ${s.row}
      border-bottom: 1px solid #eeeeee;

      li {
        ${s.row}
        margin-bottom:8px;
        ${s.grid6}

        img {
          margin-right: 16px;
          width: 40px;
          height: 40px;
          margin-bottom: 8px;
        }
      }
    }

    .diary {
      padding-top: 32px;
      h3 {
        margin-left: 16px;
        margin-bottom: 16px;
      }

      img {
        width: 100%;
        margin-bottom: 10px;
      }

      .content {
        margin-left: 16px;
      }
    }

    .map {
      height: 416px;
      margin-bottom: 32px;
    }

    h3 {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #222222;
      margin-bottom: 16px;
    }

    .comments-create {
      ${s.row}
      height: 56px;
      ${s.fluid};
      margin-bottom: 24px;

      img {
        margin-right: 16px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background: #eee;
      }

      input {
        background: #ffffff;
        border: 1px solid #9e9e9e;
        border-radius: 8px;
        height: 56px;
        flex: 1;
        padding: 0 10px;
      }

      button {
        font-size: 15px;
        line-height: 24px;
        background: #fff;
        border: none;
        padding: 4px 8px;
        margin-left: 8px;
        cursor: pointer;

        &:hover {
          background: #ff4546;
          color: white;
          border-radius: 4px;
        }
      }
    }

    .comments {
      li {
        ${s.row}
        align-items:flex-start;
        padding: 8px 0;
        border-bottom: 1px solid #eee;

        img {
          margin-right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 100%;
          background: #eee;
        }

        .name {
          ${s.row}
          height: 24px;
          font-size: 16px;
          line-height: 24px;
          color: #222222;
          margin-bottom: 8px;

          div {
            margin-right: 8px;
          }

          span {
            font-size: 11px;
            line-height: 14px;
            color: #bdbdbd;
          }
        }

        p {
          font-weight: 400;
          font-size: 16px;
          line-height: 26px;
          color: #222;
        }
      }
    }
  }
`;

const StyledActions = styled.div`
  ${s.row}

  div {
    ${s.rowCenter}
    margin-right: 10px;
    padding: 12px 16px;

    span:first-of-type {
      margin-right: 8px;
    }
  }

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
