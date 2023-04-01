import {
  NaverMapContextProvider,
  useNaverMapContext,
} from "@/store/context/NaverMap";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AuthContextProvider } from "@/store/context/AuthContext";
import Header from "@/components/layout/Header";

if (process.env.NODE_ENV === "development") {
  // require("../mocks");
}

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <NaverMapContextProvider>
            <LoadScript>
              {/* <Header /> */}
              <Component {...pageProps} />
            </LoadScript>
          </NaverMapContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function LoadScript({ children }: { children: React.ReactNode }) {
  const { setNaverMapEnabled, setGeocoderEnabled } = useNaverMapContext();

  return (
    <>
      <Script
        onLoad={() => setNaverMapEnabled(true)}
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
      />
      <Script
        onLoad={() => setGeocoderEnabled(true)}
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
      />
      {children}
    </>
  );
}
