import styled from "styled-components";
import s from "csd";
import Header2 from "@/components/layout/Header2";
import { useNaverMapContext } from "@/store/context/NaverMap";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CourseDetail() {
  const { naverMapEnabled } = useNaverMapContext();

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled) return;

    new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 13,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: true,
    });
  }, [naverMapEnabled]);

  return (
    <>
      <StyledHeader />
      <StyledCourseDetail>
        <h1>코스 이름</h1>
        <div className="images">
          <div className="map">
            <div className="date">2023-03-02</div>
            <div id="map"></div>
          </div>
          <div className="upload">
            <p>오늘의 러닝을 기념할 사진을 남겨주세요</p>
            <div className="uploader"></div>
          </div>
        </div>
        <div className="review">
          <div className="features">
            <p>달린 코스의 특징을 알려주세요</p>
            <ul>
              {[
                { name: "public-toilet", label: "화장실" },
                { name: "angle-acute", label: "화장실" },
                { name: "convenience-store", label: "화장실" },
                { name: "cafe", label: "화장실" },
                { name: "traffic-lights", label: "화장실" },
                { name: "flatten", label: "화장실" },
                { name: "construction", label: "화장실" },
                { name: "road", label: "화장실" },
              ].map(({ name, label }) => (
                <li key={name}>
                  <div>
                    <Image
                      width={24}
                      height={24}
                      src={`/icons/${name}.svg`}
                      alt=""
                    />
                    <div>{label}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="diary">
            <p>오늘의 러닝은 어떠셨나요?</p>
            <textarea></textarea>
            <button>게시하기</button>
          </div>
        </div>
      </StyledCourseDetail>
    </>
  );
}

const StyledCourseDetail = styled.div`
  margin-top: 80px;
  padding: 52px 82px;

  h1 {
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: #ff4546;
    margin-bottom: 8px;
  }

  .images {
    ${s.row}

    .map {
      ${s.grid7};
      #map {
        height: 416px;
      }
      padding-right: 56px;

      .date {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 24px;
      }
    }

    .upload {
      ${s.grid5}

      p {
        margin-bottom: 24px;
      }

      .uploader {
        height: 416px;
        background: #eee;
      }
    }

    margin-bottom: 64px;
  }

  .review {
    ${s.rowSpaceBetween}
    align-items:flex-start;

    p {
      color: #222;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    }

    .features {
      margin-right: 192px;
      ul {
        margin: 0 -12px;
        width: 480px;
        ${s.row}

        li {
          margin: 0 12px;
          height: 72px;
          width: 72px;
          background: #f5f5f5;
          border-radius: 50px;
          ${s.colCenter}

          div {
            ${s.colCenter}
            color: #757575;
            font-weight: 600;
            font-size: 11px;
            line-height: 14px;

            img {
              margin-bottom: 6px;
            }
          }
        }
      }
    }

    .diary {
      flex: 1;
      ${s.col}

      textarea {
        width: 100%;
        ${s.mb6}
      }

      button {
        align-self: flex-end;
        border: none;
        color: white;
        padding: 16px 32px;
        width: 172px;
        height: 52px;
        background: #ff4546;
        border-radius: 16px;
      }
    }
  }
`;

const StyledHeader = styled(Header2)`
  background: #ff4546;
`;
