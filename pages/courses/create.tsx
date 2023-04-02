import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { RefreshOutlined } from "@mui/icons-material";
import s from "csd";

import { useNaverMapContext } from "@/store/context/NaverMap";
import Toolbar from "@/components/map/Toolbar";
import Search from "@/components/map/Search";
import Header2 from "@/components/layout/Header2";
import { PostCourseRequest, postCourse } from "@/data/axios/course";
import { getEstimate } from "@/utils/getEstimate";
import { useAuthContext } from "@/store/context/AuthContext";
import { NextSeo } from "next-seo";

export default function Map() {
  const { user } = useAuthContext();
  const { naverMapEnabled, geocoderEnabled } = useNaverMapContext();
  const router = useRouter();
  const [map, setMap] = useState<naver.maps.Map>();
  const [path, setPath] = useState<naver.maps.LatLng[]>([]);
  const [startAddress, setStartAddress] = useState<string | null>(null);
  const [endAddress, setEndAddress] = useState<string | null>(null);

  const getAddressFromPoint = (point: naver.maps.LatLng) =>
    new Promise<string>((res, rej) => {
      naver.maps.Service.reverseGeocode(
        { coords: point },
        (status, response) => {
          if (status === 200) {
            if (response) {
              const {
                v2: {
                  results: [result],
                },
              } = response;

              if (result) {
                const { area2, area3, area4 } = result.region;
                res(
                  [area2.name, area3.name, area4.name].filter(Boolean).join(" ")
                );
              }
            }
          }
          rej("failed");
        }
      );
    });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const startPoint = path[0];
        const endPoint = path.length > 1 ? path[path.length - 1] : null;
        if (startPoint) {
          const startAddress = await getAddressFromPoint(startPoint);
          setStartAddress(startAddress);
        } else {
          setStartAddress("");
        }
        if (endPoint) {
          const endAddress = await getAddressFromPoint(endPoint);
          setEndAddress(endAddress);
        } else {
          setEndAddress("");
        }
      } catch (e) {
        window.alert("naver reverse geocode failed");
      }
    })();
  }, [path]);

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
        (error) => {}
      );
    }
  }, [map]);

  const submit = async () => {
    if (!geocoderEnabled) return;

    try {
      const firstPoint = path[0];
      const lastPoint = path[path.length - 1];

      const getAddressByLatLng = (latlng: naver.maps.LatLng) =>
        new Promise<naver.maps.Service.ReverseGeocodeResponse | null>(
          (res, rej) =>
            naver.maps.Service.reverseGeocode(
              {
                coords: latlng,
                orders: naver.maps.Service.OrderType.ROAD_ADDR,
              },
              (status, response) => {
                if (status === 200) {
                  res(response);
                  return;
                } else {
                  res(null);
                }

                rej("failed");
              }
            )
        );
      const firstPointAddress = await getAddressByLatLng(firstPoint);
      const lastPointAddress = await getAddressByLatLng(lastPoint);

      if (firstPointAddress === null || lastPointAddress === null) {
        throw new Error();
      }

      const coursePoints: PostCourseRequest["points"] = path.map((point, i) =>
        i === 0
          ? { ...point, reverseGeocodeResponse: firstPointAddress }
          : i === path.length - 1
          ? { ...point, reverseGeocodeResponse: lastPointAddress }
          : point
      );

      const resultFallback = {
        region: {
          area2: { name: "" },
          area3: { name: "" },
        },
      };

      const startResult = firstPointAddress.v2.results[0] || resultFallback;
      const endResult = lastPointAddress.v2.results[0] || resultFallback;

      const startRegion = startResult.region;
      const endRegion = endResult.region;

      const s2 = startRegion.area2.name;
      const s3 = startRegion.area3.name;
      const e2 = endRegion.area2.name;
      const e3 = endRegion.area3.name;

      const sname = s2 ? s2 + (s3 ? " " + s3 : "") : "";
      const ename = e2 ? e2 + (e3 ? " " + e3 : "") : "";

      const filteredName = [sname, ename].filter(Boolean);
      const postCourseRequest: PostCourseRequest = {
        name:
          filteredName.length === 1
            ? filteredName[0]
            : filteredName.length === 2
            ? filteredName.join("-")
            : "",
        duration: 0,
        distance: getDistance(path),
        points: coursePoints,
      };

      const { data, status } = await postCourse(postCourseRequest);

      if (status === 200) {
        router.push(`/reviews/create/${data.id}`);
      } else {
        window.alert(status);
      }
    } catch (e) {
      window.alert("다시 시도해주세요.");
    }
  };

  const getDistance = (path: naver.maps.LatLng[]) => {
    if (!map) return 0;

    return path.length < 2
      ? 0
      : path.slice(0, -1).reduce((acc, p, i) => {
          const current = p;
          const next = path[i + 1];

          return acc + map.getProjection().getDistance(current, next);
        }, 0);
  };

  const distance = getDistance(path); // m
  const estimate = getEstimate(distance); // km/h

  if (!user) return null;

  return (
    <>
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
                  <div className="value">{startAddress || ""}</div>
                </li>
                <div className="divider"></div>
                <li>
                  <div className="label">종료</div>
                  <div className="value">{endAddress || ""}</div>
                </li>
              </ul>
              <button
                className="refresh-btn"
                onClick={() => setPath((path) => [...path].reverse())}
              >
                <RefreshOutlined />
              </button>
            </div>
          </li>
          <li>
            <div className="card">
              <div className="label">이동 거리</div>
              <div className="value">{(distance / 1000).toFixed(1)}km</div>
            </div>
          </li>
          <li>
            <div className="card">
              <div className="label"> 예상 시간</div>
              <div className="value">
                {estimate.hour ? estimate.hour + "시 " : ""}
                {estimate.minute ? estimate.minute + "분" : ""}
              </div>
            </div>
          </li>
        </ul>
        <button onClick={submit} disabled={!geocoderEnabled || path.length < 2}>
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
        width: 400px;

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

        .refresh-btn {
          border: none;
          ${s.rowCenter}
          margin-left: 16px;
          cursor: pointer;
          padding: 4px;
          border: 1px solid #9e9e9e;
          box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
            2px 2px 10px rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          background: #fff;
          outline: none;
        }

        svg {
          color: #ff4546;
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
