import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import s from "csd";
import { Button } from "@mui/material";
import path from "path";
import { NearMe } from "@mui/icons-material";

const initialNaverObjects = {
  markers: [],
  polyline: null,
  clickEventListener: null,
};

export default function Toolbar({
  map,
  path,
  setPath,
}: {
  map?: naver.maps.Map;
  path: naver.maps.LatLng[];
  setPath: Dispatch<SetStateAction<naver.maps.LatLng[]>>;
}) {
  const naverObjectsRef = useRef<{
    markers: naver.maps.Marker[];
    polyline: naver.maps.Polyline | null;
    clickEventListener: naver.maps.MapEventListener | null;
  }>(initialNaverObjects);

  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!map) return;
    const naverObjects = naverObjectsRef.current;

    if (status === "idle") {
      if (naverObjects.clickEventListener) {
        map.removeListener(naverObjects.clickEventListener);
      }
    }

    if (status === "drawing") {
      naverObjects.clickEventListener = naver.maps.Event.addListener(
        map,
        "click",
        (e) => {
          const point = e.latlng as naver.maps.LatLng;

          if (status === "drawing") {
            setPath((prev) => [...prev, point]);
          }
        }
      );
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStatus("idle");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [status, map]);

  // path => marker, polyline
  useEffect(() => {
    if (!path) return;
    if (!map) return;

    const naverObjects = naverObjectsRef.current;

    naverObjects.markers.forEach((marker) => marker.setMap(null));
    naverObjects.polyline?.setMap(null);

    if (path.length === 0) {
      naverObjects.markers = [];
      naverObjects.polyline = null;
    } else {
      const polyline = new naver.maps.Polyline({
        map,
        path: path,
        strokeColor: "#FF4546",
        strokeWeight: 4,
      });

      const markers: naver.maps.Marker[] = path.map((p, i) => {
        const startOrEnd = i === 0 || i === path.length - 1;
        const color = startOrEnd ? "#0F186C" : "#FF4546";
        const size = startOrEnd ? 14 : 12;

        return new naver.maps.Marker({
          position: p,
          map,
          icon: {
            content: `<div style="width:${size}px;height:${size}px;background:#fff;transform:translate(-50%,-50%);border:solid ${color} 3px;border-radius:100%;"></div>`,
          },
        });
      });

      naverObjectsRef.current = {
        ...naverObjects,
        markers,
        polyline,
      };
    }
  }, [path, map]);

  const prev = () =>
    setPath((prev) => (prev.length === 1 ? [] : prev.slice(0, -1)));

  return (
    <StyledToolbar>
      <button onClick={() => setStatus("drawing")}>
        <img src="/icons/pen.svg" width={20} height={20} />
      </button>
      <button onClick={() => prev()}>
        <img src="/icons/redo.svg" width={20} height={20} />
      </button>
      <button
        onClick={() => {
          setStatus("idle");
          setPath([]);
        }}
      >
        <img src="/icons/delete_outline.svg" width={20} height={20} />
      </button>
    </StyledToolbar>
  );
}

const StyledToolbar = styled.div`
  ${s.col}
  position: absolute;
  top: 165px;
  right: 80px;
  z-index: 1;

  button {
    ${s.colCenter}
    width: 40px;
    height: 40px;
    border: 1px solid #9e9e9e;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    margin-right: 4px;
    background: #ffffff;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .distance {
    color: black;
    background: white;
    padding: 4px;
    border-radius: 4px;
  }
`;
