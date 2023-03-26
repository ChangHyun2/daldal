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
import { WbIncandescentTwoTone } from "@mui/icons-material";

export default function Map() {
  const [showPermissionGuideModal, setShowPermissionGuideModal] =
    useState(false);
  const { naverMapEnabled } = useNaverMapContext();
  const [geocoderEnabled, setGeocoderEnabled] = useState(false);

  const [map, setMap] = useState<naver.maps.Map>();
  const [path, setPath] = useState<naver.maps.LatLng[]>([]);

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
    if (!geocoderEnabled) return;

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];

    const getLocationByLatLng = (latlng: naver.maps.LatLng) =>
      new Promise<naver.maps.Service.ReverseGeocodeResponse | null>((res) =>
        naver.maps.Service.reverseGeocode(
          { coords: latlng },
          (status, response) => {
            if (status === 200) {
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

    console.log({ request });
  };

  return (
    <div>
      <Script
        onLoad={() => setGeocoderEnabled(true)}
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
      />
      <div
        id="map"
        style={{ width: "100%", height: "400px", position: "relative" }}
      >
        <Toolbar map={map} setPath={setPath} />
        <Search map={map} geocoderEnabled={geocoderEnabled} />
      </div>
      <Button onClick={submit} disabled={path.length < 2}>
        저장
      </Button>
    </div>
  );
}
