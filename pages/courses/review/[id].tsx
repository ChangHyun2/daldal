import styled from "styled-components";
import s from "csd";
import Header2 from "@/components/layout/Header2";
import { useNaverMapContext } from "@/store/context/NaverMap";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CourseReview() {
  const { naverMapEnabled } = useNaverMapContext();

  const router = useRouter();
  const { id } = router.query;
  console.log({ id });

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled) return;

    new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 13,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: false,
    });
  }, [naverMapEnabled]);

  return (
    <>
      <StyledHeader />
      <StyledCourseDetail>
        <div className="location-image">
          <div className="location">
            <div className="location-meta">
              <h1>송파구 잠실동-광진구 자양동</h1>
              <div className="date">2023-03-02</div>
            </div>
            <div className="location-map">
              <div id="map"></div>
              <div className="map-overlay"></div>
            </div>
          </div>
          <div className="image">
            <p>오늘의 러닝을 기념할 사진을 남겨주세요</p>
            <div className="image-uploader"></div>
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
  padding: 32px 82px;
  ${s.col}
  height: calc(100vh - 80px);

  .location-image {
    flex: 1;
    ${s.row}
    align-items:flex-start;
  }

  .location {
    flex: 1;
    margin-right: 56px;
    height: calc(100% - 60px);

    &-meta {
      ${s.row};
      align-items: flex-end;
      margin-bottom: 16px;

      h1 {
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        color: #ff4546;
        margin-right: 16px;
      }

      .date {
        color: #bdbdbd;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }
    }

    &-map {
      height: 100%;
      position: relative;

      #map {
        height: 100%;
      }

      .map-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
      }
    }
  }

  .image {
    height: 100%;
    p {
      margin-top: 13px;
      margin-bottom: 16px;
    }

    &-uploader {
      ${s.grid5}
      width: 416px;
      height: calc(100% - 60px);
      background: #eee;
    }

    margin-bottom: 24px;
  }

  .review {
    width: 100%;
    ${s.rowSpaceBetween}
    align-items:flex-start;

    p {
      color: #222;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }

    .features {
      width: 416px;

      ul {
        margin: 0 -12px;
        ${s.row}
        flex-wrap:wrap;

        li {
          width: 20%;
          padding: 0 12px;

          > div {
            ${s.colCenter}
            border-radius: 100%;
            height: 64px;
            width: 64px;
            ${s.colCenter}
            color: #757575;
            font-weight: 600;
            font-size: 11px;
            line-height: 14px;
            background: #f5f5f5;

            img {
              margin-bottom: 6px;
            }
          }
        }
      }
    }

    .diary {
      ${s.grid6}
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
