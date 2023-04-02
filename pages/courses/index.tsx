import styled from "styled-components";
import s from "csd";
import img from "next/image";
import Header2 from "@/components/layout/Header2";
import { useAuthContext } from "@/store/context/AuthContext";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourses } from "@/data/axios/course";
import { Course } from "@/data/backend/course";
import { getEstimate } from "@/utils/getEstimate";
import NaverMap from "@/components/map/naverMap";
import { useRouter } from "next/router";
import { bookmarkDown } from "@/data/axios/bookmark";
import { Review, getMyReview, getReview } from "@/data/axios/review";
import { NextSeo } from "next-seo";

export default function Courses() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    getCourses().then(({ data }) => setCourses(data));
    getMyReview().then(({ data }) => setReviews(data));
  }, [user]);

  if (!user) return null;

  return (
    <StyledCourses>
      <Header2 />
      <h2>
        <span>
          🔥 <b>{user ? "달달" : ""}</b>님, <b>49km</b>를 뛰셨네요!
        </span>
      </h2>
      <div className="courses">
        <h3>저장 된 코스</h3>
        {user && (
          <StyledCards>
            {courses.slice(0, 3).map((course) => (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  href={`/reviews/create/${course.id}`}
                  readOnly
                />
              </li>
            ))}
          </StyledCards>
        )}
      </div>
      <div className="divider"></div>
      <div className="courses">
        <h3>게시한 리뷰</h3>
        {user && (
          <StyledCards>
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} href={`/reviews/${review.id}`} />
              </li>
            ))}
          </StyledCards>
        )}
      </div>
    </StyledCourses>
  );
}

const StyledCourses = styled.div`
  padding: 52px 80px;

  h2 {
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    margin-top: 80px;
    ${s.mb5}
    margin-bottom: 16px;

    span {
      background: #fafafa;
      border-radius: 50px;
      padding: 16px 32px;
      color: #222222;
    }
  }

  h3 {
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    ${s.mb3}
    color: #FF4546;
  }

  .divider {
    margin: 20px 0;
    border-bottom: 1px solid #eee;
  }
`;

const StyledCards = styled.ul`
  ${s.row};
  flex-wrap: wrap;
  margin: 0 -8px;

  li {
    ${s.grid4};
    padding: 0 8px;
  }
`;

export function CourseCard({
  course,
  href,
}: {
  course: Course;
  readOnly?: boolean;
  href: string;
}) {
  const estimate = getEstimate(course.distance);
  const { points } = course;

  return (
    <Link href={href}>
      <StyledCourseCrad>
        <div className="card">
          <NaverMap coursePoints={points} disabled />

          <div className="body">
            <div className="head">
              <div className="address">
                <img alt="userimage" src="/icons/pin_drop.svg" />
                <div>{course.name}</div>
              </div>
            </div>
            <div className="foot">
              <div className="estimate">
                <div>
                  <img alt="userimage" src="/icons/Timeline.svg" />
                  <div>{(course.distance / 1000).toFixed(1)}Km</div>
                </div>
                <div>
                  <img alt="userimage" src="/icons/Access_time.svg" />
                  <div>
                    {estimate.hour ? estimate.hour + "시 " : ""}
                    {estimate.minute ? estimate.minute + "분" : ""}
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </div>
      </StyledCourseCrad>
    </Link>
  );
}

const StyledCourseCrad = styled.div`
  .card {
    cursor: pointer;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    transition: transform 0.3s;

    :hover {
      transform: scale(1.05);
    }

    .map {
      height: 244px;
    }
    .img {
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

    :hover {
      background: #fff5f5;
    }
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
  const r = review;
  const courseName = r.course.name;
  const estimate = getEstimate(r.course.distance);

  return (
    <Link href={href}>
      <StyledReviewCrad>
        <div className="card">
          <img className="img" src={review.imageUrl} alt="user review image" />
          <div className="body">
            <div className="head">
              <div className="address">
                <img alt="userimage" src="/icons/pin_drop.svg" />
                <div>{courseName}</div>
              </div>
              <div className="favourite">
                <img alt="userimage" src={"/icons/favorite_filled.svg"} />
                <span>{review.favourite}</span>
              </div>
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
                    {estimate.hour ? estimate.hour + ":" : ""}
                    {estimate.minute ? estimate.minute + "" : ""}
                  </div>
                </div>
              </div>
              <div className="createdAt">{review.createAt.split(" ")[0]}</div>
            </div>
          </div>
        </div>
      </StyledReviewCrad>
    </Link>
  );
}

const StyledReviewCrad = styled.div`
  .card {
    .img {
      width: 100%;
      height: 248px;
    }
    transition: transform 0.3s;

    :hover {
      transform: scale(1.05);
    }

    cursor: pointer;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    margin-bottom: 58px;
    overflow: hidden;
    border: 1px solid #e0e0e0;

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
        .favourite {
          ${s.row}
          img {
            margin-right: 4px;
          }
          span {
            margin-top: 4px;
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
        ${s.rowSpaceBetween}
        align-items:flex-end;

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
        .createdAt {
          color: #9e9e9e;
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
