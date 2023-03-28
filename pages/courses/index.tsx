import styled from "styled-components";
import s from "csd";
import Image from "next/image";
import Header2 from "@/components/layout/Header2";

export default function Courses() {
  return (
    <StyledCourses>
      <Header2 />
      <h2>달달님, 49km를 뛰셨어요!</h2>
      <div className="courses">
        <h3>안 뛴 코스</h3>
        <StyledCards>
          {Array(3)
            .fill(0)
            .map((_) => ({
              createdAt: "2023-03-25",
              time: "50:20",
              distance: "6.8km",
              name: "잠실석촌호수-한강",
            }))
            .map(({ createdAt, time, distance, name }, i) => (
              <li key={i}>
                <div className={`card card${i % 3}`}>
                  <div className="path">path</div>
                  <div className="createdAt">{createdAt}</div>
                  <div className="card-bottom">
                    <div className="name">
                      <span>
                        <Image
                          width={24}
                          height={24}
                          src="/icons/pin_drop.svg"
                          alt="clock"
                        />
                      </span>
                      <span>{name}</span>
                    </div>
                    <div className="badges">
                      <div className="badge">
                        <span>
                          <Image
                            width={24}
                            height={24}
                            src="/icons/Access_time.svg"
                            alt="clock"
                          />
                        </span>
                        <span>{time}</span>
                      </div>
                      <div className="badge">
                        <span>
                          <Image
                            width={24}
                            height={24}
                            src="/icons/timeline.svg"
                            alt="clock"
                          />
                        </span>
                        <span>{distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </StyledCards>
      </div>
      <div className="courses">
        <h3>뛴 코스</h3>
        <StyledCards>
          {Array(3)
            .fill(0)
            .map((_) => ({
              createdAt: "2023-03-25",
              time: "50:20",
              distance: "6.8km",
              name: "잠실석촌호수-한강",
            }))
            .map(({ createdAt, time, distance, name }, i) => (
              <li key={i}>
                <div className={`card card${i % 3}`}>
                  <div className="path">path</div>
                  <div className="createdAt">{createdAt}</div>
                  <div className="card-bottom">
                    <div className="name">
                      <span>
                        <Image
                          width={24}
                          height={24}
                          src="/icons/pin_drop.svg"
                          alt="clock"
                        />
                      </span>
                      <span>{name}</span>
                    </div>
                    <div className="badges">
                      <div className="badge">
                        <Image
                          width={24}
                          height={24}
                          src="/icons/Access_time.svg"
                          alt="clock"
                        />
                        <span>{time}</span>
                      </div>
                      <div className="badge">
                        <Image
                          width={24}
                          height={24}
                          src="/icons/timeline.svg"
                          alt="clock"
                        />
                        <span>{distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </StyledCards>
      </div>
    </StyledCourses>
  );
}

const StyledCourses = styled.div`
  padding: 52px 80px;

  h2 {
    margin-top: 80px;
    ${s.mb5}
  }

  h3 {
    ${s.mb3}
    color: #FF4546;
  }
`;

const StyledCards = styled.ul`
  ${s.row}
  margin: 0 -8px;
  ${s.mb5}

  li {
    ${s.grid4};
    padding: 0 8px;

    .card {
      padding: 24px;
      height: 272px;
      position: relative;
      ${s.col};
      justify-content: space-between;
      background: #fff0f0;
      border-radius: 8px;

      &1 {
        background: #e9eafc;
      }
      &2 {
        background: #def0fa;
      }

      .path {
        position: absolute;
        width: 140px;
        height: 140px;
        background: rgba(255, 255, 255, 0.6);
      }

      .createdAt {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        align-self: flex-end;
        color: #9e9e9e;
      }

      .card-bottom {
        ${s.rowSpaceBetween}
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        align-items: flex-end;

        .name {
          ${s.flex}
          img {
            margin-right: 8px;
          }
        }

        .badges {
          ${s.col}

          .badge {
            ${s.row}
            padding: 4px 10px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 8px;

            span {
              display: flex;
            }

            img {
              margin-right: 10px;
            }
          }
          .badge:not(:last-of-type) {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
`;
