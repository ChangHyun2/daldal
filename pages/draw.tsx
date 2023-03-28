import { useNaverMapContext } from "@/store/context/NaverMap";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import s from "csd";

import { Button, Modal } from "@mui/material";
import Image from "next/image";
import Toolbar from "@/components/map/Toolbar";
import Search from "@/components/map/Search";
import Script from "next/script";
import { isFunctionDeclaration } from "typescript";
import {
  RefreshOutlined,
  Router,
  WbIncandescentTwoTone,
} from "@mui/icons-material";
import Header2 from "@/components/layout/Header2";
import { useRouter } from "next/router";

export default function Map() {
  const [showPermissionGuideModal, setShowPermissionGuideModal] =
    useState(false);
  const { naverMapEnabled } = useNaverMapContext();
  const [geocoderEnabled, setGeocoderEnabled] = useState(false);

  const [map, setMap] = useState<naver.maps.Map>();
  const [path, setPath] = useState<naver.maps.LatLng[]>([]);
  const router = useRouter();

  const getDistance = (path: naver.maps.LatLng[]) => {
    console.log({ map, path });
    if (!map) return 0;

    return path.length < 2
      ? 0
      : path.slice(0, -1).reduce((acc, p, i) => {
          const current = p;
          const next = path[i + 1];

          return acc + map.getProjection().getDistance(current, next);
        }, 0);
  };

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled) return;

    setMap(
      new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 13,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.RIGHT_CENTER,
        },
      })
    );
  }, [naverMapEnabled]);

  // geo location
  useEffect(() => {
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const {
            coords: { latitude, longitude },
          } = pos;

          const location = new naver.maps.LatLng(latitude, longitude);
          map.setCenter(location);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [map]);

  const submit = async () => {
    console.log("submit");
    if (!geocoderEnabled) return;

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];

    const getLocationByLatLng = (latlng: naver.maps.LatLng) =>
      new Promise<naver.maps.Service.ReverseGeocodeResponse | null>((res) =>
        naver.maps.Service.reverseGeocode(
          { coords: latlng, orders: naver.maps.Service.OrderType.ROAD_ADDR },
          (status, response) => {
            if (status === 200) {
              console.log({ response });
              res(response);
            } else {
              res(null);
            }
          }
        )
      );
    const firstPointLocation = await getLocationByLatLng(firstPoint);
    const lastPointLocation = await getLocationByLatLng(lastPoint);

    if (firstPointLocation === null || lastPointLocation === null) {
      return window.alert("다시 시도해주세요.");
    }

    const request = path.map((point, i) =>
      i === 0
        ? { ...point, reverseGeocodeResponse: firstPointLocation }
        : i === path.length - 1
        ? { ...point, reverseGeocodeResponse: lastPointLocation }
        : point
    );

    const created = { id: "1" };
    router.push(`/courses/review/${created.id}`);
  };

  return (
    <>
      <Script
        onLoad={() => setGeocoderEnabled(true)}
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
      />
      <Header2 />
      <StyledDraw>
        <div id="map" style={{ height: "100vh" }}>
          <Toolbar map={map} setPath={setPath} path={path} />
        </div>

        <div className="search">
          <Search map={map} geocoderEnabled={geocoderEnabled} />
        </div>

        <ul className="meta">
          <li>
            <div className="card card-time">
              <ul>
                <li>
                  <div className="label">시작</div>
                  <div className="value">6.8km</div>
                </li>
                <div className="divider"></div>
                <li>
                  <div className="label">종료</div>
                  <div className="value">6.8km</div>
                </li>
              </ul>
              <RefreshOutlined />
            </div>
          </li>
          <li>
            <div className="card">
              <div className="label">이동 거리</div>
              <div className="value">
                {(getDistance(path) / 1000).toFixed(1)}km
              </div>
            </div>
          </li>
          <li>
            <div className="card">
              <div className="label"> 예상 시간</div>
              <div className="value">10:50:20</div>
            </div>
          </li>
        </ul>

        <button onClick={submit} disabled={path.length < 2}>
          저장하기
        </button>
      </StyledDraw>
    </>
  );
}

const StyledDraw = styled.div`
  position: relative;

  #map {
    height: calc(100vh-80px);
    width: 100%;
  }

  .search {
    position: absolute;
    left: 80px;
    top: 112px;
    z-index: 100;
  }

  .meta {
    position: absolute;
    left: 80px;
    bottom: 48px;
    z-index: 100;
    display: flex;
    margin: 0 -16px;

    > li {
      min-width: 260px;
      padding: 0 16px;

      .card {
        height: 100%;
        padding: 16px 24px;
        background: #ffffff;
        border: 1px solid #616161;
        box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
          2px 2px 10px rgba(0, 0, 0, 0.04);
        border-radius: 8px;

        .label {
          font-weight: 600;
          font-size: 17px;
          line-height: 24px;
          margin-bottom: 24px;
          color: #616161;
        }

        .value {
          font-weight: 600;
          font-size: 20px;
          line-height: 26px;
          letter-spacing: -0.012em;
          color: #222222;
        }
      }

      .card-time {
        ${s.row}
        width: 286px;

        ul {
          flex: 1;

          li {
            ${s.row};
            font-weight: 600;
            font-size: 20px;
            line-height: 26px;

            .label {
              margin-right: 24px;
              margin-bottom: 0;
            }
          }

          .divider {
            margin: 12px 0;
            border: 1px solid #eeeeee;
          }
        }

        svg {
          color: #ff4546;
          margin-left: 16px;
        }
      }
    }
  }

  > button {
    position: absolute;
    right: 80px;
    bottom: 48px;
    z-index: 100;
    padding: 16px 32px;
    background: #ff4546;
    width: 200px;
    height: 52px;
    border-radius: 8px;
    border: none;
    color: #ffffff;
    cursor: pointer;

    :disabled {
      cursor: not-allowed;
      background: #772324;
    }
  }
`;
