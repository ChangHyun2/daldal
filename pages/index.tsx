import { useAuthContext } from "@/store/context/AuthContext";
import styled from "styled-components";
import s from "csd";
import Image from "next/image";
import { useEffect } from "react";
import { useNaverMapContext } from "@/store/context/NaverMap";
import Header2 from "@/components/layout/Header2";
import { useSession } from "next-auth/react";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <StyledHome>
      <Header2 />
      <div className="background"></div>
      <StyledMain style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "-100px",
            height: "100px",
            width: "100%",
            background: "#0f186c",
          }}
        ></div>
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
          당신의 인생에도, 당신의 러닝에도
          <br /> 변수가 없도록
        </h1>
        <Courses />
      </StyledMain>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  position: relative;

  .background {
    z-index: -1;
    position: fixed;
    top: 0;
    width: 100%;
    background: #0f186c;
    height: 415px;
  }
`;

const StyledSvg = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
const StyledMain = styled.main`
  margin-top: 80px;

  h1 {
    color: #fff;
    font-size: 36px;
    line-height: 52px;
    font-weight: 700;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 60px;
  }
`;

function Courses() {
  return (
    <StyledCourse>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <CourseItem key={i} id={i} />
        ))}
    </StyledCourse>
  );
}

const StyledCourse = styled.ul`
  > li {
    width: 608px;
    margin: 0 auto;
    ${s.mb5}

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      color: white;

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
    }

    .body {
      ${s.row}
      margin: 0 -8px;
      margin-bottom: 20px;

      li {
        ${s.grid6}
        padding: 8px;

        .img {
          width: 100%;
          height: 296px;
          background: #eee;
        }
      }
    }

    .footer {
      .features {
        ${s.row}
        ${s.mb2}
          margin-bottom: 16px;

        li {
          margin-right: 12px;
        }
      }

      .review {
        ${s.row};
        align-items: start;
        flex-wrap: nowrap;

        .diary {
          flex: 1;
          font-size: 16px;
          font-weight: 400;
        }

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

function CourseItem({ id }: { id: number }) {
  const { naverMapEnabled } = useNaverMapContext();

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled) return;

    new naver.maps.Map(`map${id}`, {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 13,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: false,
      baseTileOpacity: 1,
      disableDoubleClickZoom: true,
      disableKineticPan: true,
      disableDoubleTapZoom: true,
      disableTwoFingerTapZoom: true,
      draggable: false,
      pinchZoom: false,
    });
  }, [naverMapEnabled]);

  return (
    <li>
      <div className="top">
        <div className="top-left">
          <div className="avatar" />
          <div>김민지 님</div>
        </div>
        <div>4시간 전</div>
      </div>
      <ul className="body">
        <li>
          <div className="img"></div>
        </li>
        <li className="map-wrapper">
          <div className="img map" id={`map${id}`}></div>
          <div className="map-overlay"></div>
        </li>
      </ul>
      <div className="footer">
        <ul className="features">
          {[
            { name: "public-toilet" },
            { name: "angle-acute" },
            { name: "convenience-store" },
            { name: "cafe" },
            { name: "traffic-lights" },
            { name: "flatten" },
            { name: "construction" },
            { name: "road" },
          ].map(({ name }) => (
            <li key={name}>
              <Image
                width={24}
                height={24}
                src={`/icons/${name}.svg`}
                alt="acute"
              />
            </li>
          ))}
        </ul>
        <div className="review">
          <div className="diary">
            오늘 처음으로 달리기를 했는데 재밌었다!! 오늘 처음으로 달리기를
            했는데 재밌었다!! 오늘 처음으로 달리기를 했는데 재밌었다!!
          </div>
          <div className="badge">
            <span>뿌듯해요</span>
            <span className="emoji">😆</span>
          </div>
        </div>
      </div>
    </li>
  );
}
