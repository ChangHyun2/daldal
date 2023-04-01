import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import s from "csd";

let timer: NodeJS.Timeout | undefined;

export default function Search({
  map,
  geocoderEnabled,
}: {
  map?: naver.maps.Map;
  geocoderEnabled: boolean;
}) {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!geocoderEnabled) return;

    if (keyword) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        naver.maps.Service.geocode({ query: keyword }, (status, response) => {
          if (status === 200) {
            if (response.v2.addresses.length === 0) return;

            const { x, y } = response.v2.addresses[0];
            map?.setCenter({ x: Number(x), y: Number(y) });
            map?.setZoom(13);
          }
        });
        timer = undefined;
      }, 300);
    }
  }, [keyword]);

  return (
    <StyledSearch>
      <div className="searchbar">
        <input
          placeholder="찾으시는 지역의 이름을 입력하세요"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <SearchOutlined />
      </div>
    </StyledSearch>
  );
}

const StyledSearch = styled.div`
  .searchbar {
    ${s.rowSpaceBetween}
    width: 475px;
    height: 53px;
    padding: 14px 16px;
    border-radius: 20px;
    background: white;
    border: 1px solid #9e9e9e;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06),
      2px 2px 10px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    font-size: 15px;

    svg {
      color: black;
    }

    input {
      flex: 1;
      background: white;
      border: none;
      color: black;
      outline: none;
      line-height: 24px;
    }
  }

  .addresses {
    padding: 10px;
    background: white;
    color: black;

    li:not(:last-of-type) {
      margin-bottom: 4px;
    }
  }
`;
