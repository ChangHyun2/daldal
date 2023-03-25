import { useNaverMapContext } from "@/store/context/NaverMap";
import { useEffect, useRef } from "react";

export default function Map() {
  const { naverMapEnabled } = useNaverMapContext();
  const mapRef = useRef<naver.maps.Map>();

  useEffect(() => {
    if (!naverMapEnabled) return;

    var map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: true,
    });

    mapRef.current = map;
  }, [naverMapEnabled]);

  const startDraw = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    var polyline = new naver.maps.Polyline({
      map: map,
      path: [],
      strokeColor: "#5347AA",
      strokeWeight: 2,
    });

    naver.maps.Event.addListener(map, "click", function (e) {
      var point = e.latlng;

      var path = polyline.getPath();
      path.push(point);

      new naver.maps.Marker({
        map: map,
        position: point,
      });
    });
  };
  const endDraw = () => {};

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      <button onClick={startDraw}>그리기 시작</button>
      <button onClick={endDraw}>그리기 종료</button>
    </div>
  );
}
