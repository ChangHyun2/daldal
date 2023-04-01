import styled from "styled-components";
import s from "csd";
import { useEffect, useState } from "react";
import { getReviewPopular } from "@/data/axios/review/popular";
import { getReviewFilter } from "@/data/axios/review/filter";
import { FEATURES, Review, ReviewFeature } from "@/data/axios/review";
import { getCourses } from "@/data/axios/course";
import { useAuthContext } from "@/store/context/AuthContext";
import Slider from "react-slick";
import NaverMap from "@/components/map/naverMap";
import { getEstimate } from "@/utils/getEstimate";

import { CoursePoint } from "@/data/backend/course";
import path from "path";
import { Router, useRouter } from "next/router";
import { bookmarkDown, bookmarkUp } from "@/data/axios/bookmark";
import Header2 from "@/components/layout/Header2";
import Link from "next/link";
import img from "next/image";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<boolean[]>(FEATURES.map((f) => false));
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    getReviewFilter({
      dto: {
        features: filter
          .map((_, i) => _ && FEATURES[i].name)
          .filter(Boolean) as ReviewFeature[],
      },
      page: 0,
      size: 100,
    }).then(({ data }) => {
      if (data) {
        const { content } = data;
        setReviews(content);
      }
    });
  }, [user, filter]);

  return (
    <StyledReviewPopular>
      <Header2 />
      <section>
        <h1>인기 코스</h1>
        <Slides />
      </section>
      <div className="divider"></div>
      <section>
        <h1>전체 코스</h1>
        <ul className="filter">
          {FEATURES.map((f, i) => (
            <li key={f.name}>
              <button
                className={filter[i] ? "target" : ""}
                onClick={() =>
                  setFilter((prev) => [
                    ...prev.slice(0, i),
                    !prev[i],
                    ...prev.slice(i + 1),
                  ])
                }
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
        <StyledCards>
          {reviews.map((r) => {
            return (
              <li key={r.id}>
                <ReviewCard review={r} href={`/reviews/${r.id}`} />
              </li>
            );
          })}
        </StyledCards>
      </section>
    </StyledReviewPopular>
  );
}

const StyledCards = styled.div`
  width: 100%;
  ${s.row}
  margin: 0 -8px;

  li {
    ${s.grid4}
    padding: 0 8px;
  }
`;

export function ReviewCard({
  review,
  readOnly = false,
  href,
}: {
  review: any;
  readOnly?: boolean;
  href: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(review.isBookmarked);
  const r = review;
  const router = useRouter();
  const { user } = useAuthContext();

  const courseName = r.course.name;

  const estimate = getEstimate(r.course.distance);
  const { points } = r.course;

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  if (!user) return null;

  return (
    <Link href={href}>
      <StyledReviewCrad>
        <div className="card">
          <NaverMap coursePoints={points} disabled />
          <div className="body">
            <div className="head">
              <div className="address">
                <img alt="userimage" src="/icons/pin_drop.svg" />
                <div>{courseName}</div>
              </div>
              {readOnly ? null : (
                <div
                  className="bookmark"
                  onClick={(e) => {
                    e.preventDefault();

                    isBookmarked
                      ? bookmarkDown(r.course.id)
                      : bookmarkUp(r.course.id);
                    setIsBookmarked((prev: boolean) => !prev);
                  }}
                >
                  <img
                    alt="userimage"
                    src={`/icons/Bookmark_${
                      isBookmarked ? "filled" : "outline"
                    }.svg`}
                  />
                  <div>{r.course.bookamark + (isBookmarked ? 1 : 0)}</div>
                </div>
              )}
            </div>
            <div className="foot">
              <div className="estimate">
                <div>
                  <img alt="userimage" src="/icons/Timeline.svg" />
                  <div>{(r.course.distance / 1000).toFixed(1)}Km</div>
                </div>
                <div>
                  <img alt="userimage" src="/icons/Access_time.svg" />
                  <div>
                    {estimate.hour ? estimate.hour + "시 " : ""}
                    {estimate.minute ? estimate.minute + "분" : ""}
                  </div>
                </div>
              </div>
              {readOnly ? (
                <button className="review-btn">
                  <span>
                    <img
                      alt="userimage"
                      src="/icons/Edit.svg"
                      width={24}
                      height={24}
                    />
                  </span>
                  <span>평가하기</span>
                </button>
              ) : (
                <ul className="features">
                  {r.features.map((f: string, i: number) => (
                    <li key={i}>
                      <img
                        alt="userimage"
                        src={`/icons/feature_large_gray/angle-acute.svg`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </StyledReviewCrad>
    </Link>
  );
}

const StyledReviewCrad = styled.div`
  .card {
    cursor: pointer;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    margin-bottom: 58px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    transition: transform 0.3s;

    :hover {
      transform: scale(1.05);
    }

    .map {
      height: 244px;
    }

    .body {
      padding: 16px 16px 26px 16px;

      .head {
        ${s.rowSpaceBetween}
        ${s.mb3}

          .address {
          ${s.row}
          img {
            margin-right: 8px;
          }
        }

        .bookmark {
          ${s.rowCenter}
          img {
            cursor: pointer;
            margin-right: 8px;
          }
        }
      }

      .foot {
        position: relative;

        .estimate {
          > div {
            ${s.row}

            img {
              width: 24px;
              height: 24px;
              margin-right: 16px;
            }

            div {
            }
          }
        }

        .features {
          position: absolute;
          ${s.row}
          right: 0;
          bottom: 26px;

          li {
            width: 20%;

            img {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }

  .review-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    ${s.row}
    padding: 16px 32px;
    border: 1px solid #ff4546;
    border-radius: 8px;
    background: none;
    color: red;
    cursor: pointer;
  }
`;

const StyledReviewPopular = styled.div`
  margin-top: 80px;
  padding: 32px 80px;

  h1 {
    font-weight: 600;
    font-size: 20px;
    line-height: 26px;
    margin-bottom: 24px;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -0.023em;
    color: #ff4546;
  }

  .divider {
    height: 1px;
    border-top: 1px solid #eeeeee;
    margin-bottom: 24px;
  }

  section:last-of-type {
    ${s.rowSpaceBetween}
  }

  .filter {
    ${s.row}
    margin-bottom:24px;

    li:not(:last-of-type) {
      margin-left: 8px;
    }

    button {
      padding: 8px 16px;
      border: 1px solid #9e9e9e;
      border-radius: 50px;
      background: #ffffff;
      cursor: pointer;

      &.target {
        border: 1px solid #ff4546;
        border-radius: 50px;
      }
    }
  }
`;

function Slides() {
  const [popularReviews, setPopularReviews] = useState<Review[]>([]);

  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    getReviewPopular().then(({ data }) => {
      if (data) {
        setPopularReviews(data);
      }
    });
  }, [user]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <StyledSlides>
      <Slider {...settings}>
        {popularReviews.map((review) => (
          <StyledSlide key={review.id} review={review} />
        ))}
      </Slider>
    </StyledSlides>
  );
}

const StyledSlide = ({ review }: { review: any }) => {
  const r = review;
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState<Boolean>(
    review.isBookmarked
  );

  return (
    <div className="slide" key={r.id}>
      <NaverMap
        coursePoints={r.course.points as CoursePoint[]}
        disabled={true}
      />
      <div className="overlay" />
      <div className="content">
        <div className="badge">{r.course.name}</div>
        <div className="right">
          <div className="bookmark">
            <img src={`/icons/bookmark_filled.svg`} alt="userimage" />
            <div>{r.favourite}</div>
          </div>
          <div className="info">
            <div className="estimate">
              <div>
                <img src="/icons/Timeline.svg" alt="userimage" />
                <div>{r.course.distance}</div>
              </div>
              <div>
                <img src="/icons/Access_time.svg" alt="userimage" />
                <div>{r.course.duration}</div>
              </div>
            </div>
            <div className="features">
              <ul>
                {FEATURES.slice(0, 5).map((f) => (
                  <li key={f.name}>
                    <img src={`/icons/Timeline.svg`} alt="userimage" />
                  </li>
                ))}
              </ul>
              <ul>
                {FEATURES.slice(5).map((f) => (
                  <li key={f.name}>
                    <img src={`/icons/Timeline.svg`} alt="userimage" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="links">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked((prev) => !prev);
                  isBookmarked
                    ? bookmarkUp(r.course.id)
                    : bookmarkDown(r.course.id);
                }}
              >
                <span>
                  <img
                    src={`/icons/Bookmark_${
                      isBookmarked ? "filled" : "outline"
                    }.svg`}
                    alt="userimage"
                  />
                </span>
                <span>저장하기</span>
              </button>
              <button onClick={() => router.push(`/reviews/${r.id}`)}>
                <span>
                  <img src={`/icons/open_in_new_red.svg`} alt="userimage" />
                </span>
                <span> 상세보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledSlides = styled.div`
  margin-bottom: 48px;

  .slide {
    position: relative;
    height: 396px;

    .map {
      position: absolute;
      top: 0;
      left: 0;
      height: 396px;
    }

    .overlay {
      position: absolute;
      width: 639px;
      height: 396px;
      top: 0px;
      right: 0;

      background: linear-gradient(
        270deg,
        rgba(255, 255, 255, 0.9) 42.56%,
        rgba(255, 255, 255, 0) 88.82%
      );
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      padding: 23px 27px 27px 29px;
      width: 100%;
      height: 100%;
      ${s.rowSpaceBetween}
      align-items:flex-start;

      .badge {
        font-weight: 600;
        font-size: 20px;
        line-height: 26px;
        letter-spacing: -0.012em;
        color: #0f186c;
        background: #ffffff;
        border: 1px solid #616161;
        border-radius: 50px;
        padding: 16px 32px;
      }

      .right {
        height: 100%;
        ${s.col}
        justify-content:space-between;

        .bookmark {
          align-self: flex-end;
          ${s.rowCenter}
          font-size: 16px;
          line-height: 24px;

          img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
        }

        .info {
          .estimate {
            margin-bottom: 48px;
            font-weight: 400;
            font-size: 20px;
            line-height: 26px;
            /* identical to box height, or 130% */
            text-align: center;
            letter-spacing: -0.012em;

            /* Gray/900 */

            > div {
              ${s.row}
              margin-bottom: 8px;
              margin-right: 8px;
              img {
                margin-right: 8px;
              }
              div {
                margin-top: 2px;
              }
            }
          }

          .features {
            margin-bottom: 26px;

            ul {
              display: flex;
              margin-bottom: 4px;

              img {
                width: 24px;
                height: 24px;
                margin-right: 8px;
              }
            }
          }

          .links {
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
                margin-right: 86px;
              }

              &:hover {
                background: #fff5f5;
              }

              img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
`;
