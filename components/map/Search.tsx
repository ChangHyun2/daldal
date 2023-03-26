import { SearchOutlined } from "@mui/icons-material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import s from "csd";
import Script from "next/script";

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
        console.log("call naver map");

        naver.maps.Service.geocode({ query: keyword }, (status, response) => {
          if (status === 200) {
            if (response.v2.addresses.length === 0) return;

            const { x, y } = response.v2.addresses[0];
            map?.setCenter({ x: Number(x), y: Number(y) });
          }
        });
        timer = undefined;
      }, 300);
    }
  }, [keyword]);

  return (
    <StyledSearch>
      <div className="searchbar">
        <SearchOutlined />
        <input
          placeholder="위치 검색"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </div>
    </StyledSearch>
  );
}

const StyledSearch = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;

  .searchbar {
    ${s.rowCenter}
    padding: 10px;
    border-radius: 20px;
    background: white;

    svg {
      color: black;
    }

    input {
      background: white;
      border: none;
      color: black;
      outline: none;
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
