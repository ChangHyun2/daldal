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
import {
  AuthContextProvider,
  useAuthContext,
} from "@/store/context/AuthContext";
import { DefaultSeo } from "next-seo";

if (process.env.NODE_ENV === "development") {
  // require("../mocks");
}

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Nimble"
        description="당신의 인생에도, 당신의 러닝에도 변수가 없도록! 님블 서비스로 사람들과 러닝 코스를 공유해보세요."
        openGraph={{
          url: "https://nimble-daldal.vercel.app",
          title: "Nimble",
          description:
            "당신의 인생에도, 당신의 러닝에도 변수가 없도록! 님블 서비스로 사람들과 러닝 코스를 공유해보세요.",
          images: [
            {
              url: "https://kr.object.ncloudstorage.com/daldal-bucket/logo/thumbnail_img_800x600-01.png",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/svg",
            },
          ],
          siteName: "Nimble",
        }}
      />
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
    </>
  );
}

function LoadScript({ children }: { children: React.ReactNode }) {
  const { setNaverMapEnabled, setGeocoderEnabled } = useNaverMapContext();

  const { autoLogin } = useAuthContext();

  useEffect(() => {
    autoLogin();
  }, []);

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
