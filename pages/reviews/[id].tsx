import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import s from "csd";
import { FEATURES, Review, SENTIMENTS, getReview } from "@/data/axios/review";
import NaverMap from "@/components/map/naverMap";
import { useAuthContext } from "@/store/context/AuthContext";
import Header2 from "@/components/layout/Header2";
import img from "next/image";
import { getEstimate } from "@/utils/getEstimate";
import { f } from "msw/lib/glossary-de6278a9";
import { favouriteDown, favouriteUp } from "@/data/axios/favourite";
import { bookmarkDown, bookmarkUp } from "@/data/axios/bookmark";
import { NextSeo } from "next-seo";

export default function ReviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [review, setReview] = useState<Review | null>(null);

  const { user } = useAuthContext();
  const [commentValue, setCommentValue] = useState("");

  const [bookmark, setBookmark] = useState(review?.course.bookamark || 0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    review?.isBookmarked ?? false
  );

  const [favorite, setFavorite] = useState(review?.favourite || 0);
  const [isFavourite, setIsFavorite] = useState<boolean>(
    review?.isFavorite ?? false
  );

  const handleClickBookmarkBtn = (e: any, review: Review) => {
    e.stopPropagation();
    e.preventDefault();

    setIsBookmarked((prev) => !prev);
    setBookmark((prev) => prev + (isBookmarked ? -1 : 1));

    isBookmarked
      ? bookmarkDown(review.course.id)
      : bookmarkUp(review.course.id);
  };

  const handleClickFavoriteBtn = (e: any, review: Review) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    setFavorite((prev) => (isFavourite ? prev - 1 : prev + 1));
    isFavourite ? favouriteDown(review.id) : favouriteUp(review.id);
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      if (typeof id !== "string") return;

      getReview(id).then(({ data }) => {
        if (data) {
          setReview(data);
          setIsFavorite(data.isFavorite);
          setIsBookmarked(data.isBookmarked);
          setBookmark(data.course.bookamark);
          setFavorite(data.favourite);
        } else {
          router.push("/reviews");
        }
      });
    }
  }, [user, id]);

  if (review === null) {
    return null;
  }
  if (!user) return null;

  const isMyReview = review?.member.email === user?.email;

  const estimate = getEstimate(review.course.distance); // km/h

  return (
    <StyledReviewDetail>
      <Header2 />
      <div className="header">
        <div className="header-left">
          <h1>{review.course.name || ""}</h1>
          <span>{review.createAt.split(" ")[0]}</span>
        </div>
        {isMyReview ? (
          <StyledActions>
            <div>
              <span>
                <img alt="userimage" src={"/icons/favorite_filled.svg"} />
              </span>
              <span>{(review.favourite || 0) + (isFavourite ? 1 : 0)}</span>
            </div>
            <div>
              <span>
                <img alt="userimage" src={`/icons/Bookmark_filled.svg`} />
              </span>
              <span>
                {(review.course.bookamark || 0) + (isBookmarked ? 1 : 0)}
              </span>
            </div>
          </StyledActions>
        ) : (
          <StyledActions>
            <button
              onClick={(e) => {
                handleClickFavoriteBtn(e, review);
              }}
            >
              <span>
                <img
                  src={`/icons/${
                    isFavourite ? "favorite_filled" : "favorite_outline"
                  }.svg`}
                  alt="userimage"
                />
              </span>
              <span>{favorite}</span>
            </button>
            <button onClick={(e) => handleClickBookmarkBtn(e, review)}>
              <span>
                <img
                  src={`/icons/Bookmark_${
                    isBookmarked ? "filled" : "outline"
                  }.svg`}
                  alt="userimage"
                />
              </span>
              <span>{bookmark}</span>
            </button>
          </StyledActions>
        )}
      </div>
      <div className="body">
        <div className="left">
          <div className="estimate">
            <div className="dist">
              <div className="label">거리</div>
              <div>{(review.course.distance / 1000).toFixed(1)}Km</div>
            </div>
            <div className="time">
              <div className="label">예상 시간</div>
              <div>
                {(estimate.hour ? estimate.hour + ":" : "00:") +
                  (estimate.minute ? estimate.minute : "")}
              </div>
            </div>
          </div>
          <div>
            <ul className="features">
              {review.features.map((feature) => {
                const f = FEATURES.find((f) => f.name === feature);

                return (
                  <li key={feature}>
                    <img
                      alt="userimage"
                      src={`/icons/feature_large_red/${f?.icon || ""}.svg`}
                    />
                    <div>{f ? `${f.label}이 있어요.` : ""}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="diary">
            <h3>한 줄 일기</h3>
            <img alt="userimage" src={review.imageUrl} />
            <p>{review.content}</p>
            <div className="sentiment">
              <img
                className="emoji"
                src={`/icons/emoji/${review.sentiment}.svg`}
              />
              <span>
                {SENTIMENTS.find((s) => s.name === review.sentiment)?.label ||
                  ""}
              </span>
            </div>
          </div>
        </div>
        <div className="right">
          <NaverMap coursePoints={review.course.points} disabled />
          <h3>댓글</h3>
          {!isMyReview && (
            <div className="comments-create">
              <img alt="userimage" src={review.member.profileImageUrl} />
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
                <img alt="userimage" src={review.member.profileImageUrl} />
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

      > img {
        width: 100%;
        margin-bottom: 10px;
      }

      .sentiment {
        margin-top: 10px;
        width: fit-content;
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
          margin-bottom: -2px;
          margin-right: 5px;
        }
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
