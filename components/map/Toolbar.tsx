import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import s from "csd";
import { Button } from "@mui/material";
import path from "path";

let track: naver.maps.Polyline | null = null;

let clickEventListener: naver.maps.MapEventListener | null = null;
let lastPoint: naver.maps.Point | null = null;

export default function Toolbar({
  map,
  setPath,
}: {
  map?: naver.maps.Map;
  setPath: Dispatch<SetStateAction<naver.maps.LatLng[]>>;
}) {
  const [status, setStatus] = useState("idle");
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!map) return;

    if (status === "idle") {
      if (clickEventListener) {
        lastPoint = null;
        map.removeListener(clickEventListener);
      }
    }

    if (status === "drawing" || status === "pinning") {
      if (status === "drawing") {
        if (track) {
          deletePath();
        }

        track = new naver.maps.Polyline({
          map,
          path: [],
          strokeColor: "#5347AA",
          strokeWeight: 2,
        });
      }

      clickEventListener = naver.maps.Event.addListener(map, "click", (e) => {
        const point = e.latlng as naver.maps.LatLng;

        if (status === "pinning") {
          new naver.maps.Marker({
            map: map,
            position: point,
          });
        }

        if (status === "drawing") {
          if (track) {
            var path = track.getPath();
            setPath((prev) => [...prev, point]);
            path.push(point);

            setDistance((prev) => {
              if (lastPoint) {
                return prev + map.getProjection().getDistance(lastPoint, point);
              } else {
                lastPoint = point;
                return 0;
              }
            });
          }
        }
      });
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStatus("idle");
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [status, map]);

  const deletePath = () => {
    if (!track) return;
    track.setMap(null);
    track = null;
    lastPoint = null;
    setStatus("idle");
    setPath([]);
    setDistance(0);
  };

  return (
    <StyledToolbar>
      <button onClick={() => setStatus("drawing")}>🖌</button>
      <button onClick={() => setStatus("pinning")}>📍</button>
      <button onClick={() => console.log("pop")}>{"↩️"}</button>
      <button onClick={deletePath}>🗑</button>

      <div className="distance"> {`${(distance / 1000).toFixed(3)}km`}</div>
    </StyledToolbar>
  );
}

const StyledToolbar = styled.div`
  ${s.row}
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
  z-index: 1;

  button {
    ${s.colCenter}
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 4px;
    border: none;
    margin-right: 4px;
    cursor: pointer;
  }

  .distance {
    color: black;
    background: white;
    padding: 4px;
    border-radius: 4px;
  }
`;
