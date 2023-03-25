import { useAuthContext } from "@/store/context/AuthContext";
import { useNaverMapContext } from "@/store/context/NaverMap";
import { useEffect } from "react";

export default function Map() {
  const { naverMapEnabled } = useNaverMapContext();

  useEffect(() => {
    if (!naverMapEnabled) return;

    var map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    });
  }, [naverMapEnabled]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
