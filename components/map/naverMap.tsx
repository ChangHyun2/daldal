import { CoursePoint } from "@/data/backend/course";
import { useNaverMapContext } from "@/store/context/NaverMap";
import styled from "@emotion/styled";
import { access } from "fs";
import path from "path";
import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
export const getCenter = (path: Point[]) => {
  const { x, y } = path.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    {
      x: 0,
      y: 0,
    }
  );

  return {
    x: x / path.length,
    y: y / path.length,
  };
};

export default function NaverMap({
  coursePoints,
  disabled,
}: // center,
{
  coursePoints: CoursePoint[];
  disabled: boolean;
  // center: { x: number; y: number };
}) {
  const { naverMapEnabled } = useNaverMapContext();
  const [map, setMap] = useState<naver.maps.Map>();
  const [id, setId] = useState<string | null>(null);
  const centerRef = useRef(getCenter(coursePoints));

  useEffect(() => {
    setId(window.crypto.randomUUID());
  }, []);

  // path => marker, polyline
  useEffect(() => {
    if (!coursePoints) return;
    if (!map) return;

    new naver.maps.Polyline({
      map,
      path: coursePoints,
      strokeColor: "#FF4546",
      strokeWeight: 4,
    });

    coursePoints.map((p, i) => {
      const startOrEnd = i === 0 || i === coursePoints.length - 1;
      const color = startOrEnd ? "#0F186C" : "#FF4546";
      const size = startOrEnd ? 14 : 12;

      new naver.maps.Marker({
        position: p,
        map,
        icon: {
          content: `<div style="width:${size}px;height:${size}px;background:#fff;transform:translate(-50%,-50%);border:solid ${color} 3px;border-radius:100%;"></div>`,
        },
      });
    });
  }, [id, coursePoints, map]);

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled || !id) return;

    const center = centerRef.current;
    if (!center) return;
    const fallbackCenter = { x: 37.42829747263545, y: 126.76620435615891 };
    const { x, y } = center.x + center.y === 0 ? fallbackCenter : center;

    setMap(
      new naver.maps.Map(id, {
        center: new naver.maps.LatLng(y, x),
        zoom: 13,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: !disabled,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.RIGHT_CENTER,
        },
      })
    );
  }, [id, naverMapEnabled, coursePoints, disabled]);

  return (
    <div style={{ position: "relative" }}>
      <div className="map" id={id || ""}></div>
      <StyledDisabled />
    </div>
  );
}

const StyledDisabled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
`;
