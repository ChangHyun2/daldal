import { Html, Head, Main, NextScript } from "next/document";
import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { NextSeo } from "next-seo";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <NextSeo
          title="Nimble"
          description="당신의 인생에도, 당신의 러닝에도 변수가 없도록! 님블 서비스로 사람들과 러닝 코스를 공유해보세요."
          openGraph={{
            type: "website",
            url: "https://nimble-daldal.vercel.app",
            title: "Nimble",
            description:
              "당신의 인생에도, 당신의 러닝에도 변수가 없도록! 님블 서비스로 사람들과 러닝 코스를 공유해보세요.",
            images: [
              {
                url: "https://kr.object.ncloudstorage.com/daldal-bucket/logo/logo.svg",
                width: 800,
                height: 600,
                alt: "Og Image Alt",
                type: "image/svg",
              },
            ],
            siteName: "Nimble",
          }}
        />
        <Head>
          <link
            rel="shortcut icon"
            href="https://kr.object.ncloudstorage.com/daldal-bucket/logo/logo.ico"
          />
          <title>Nimble</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
