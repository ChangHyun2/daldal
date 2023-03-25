const ENDPOINT =
  "https://0vqix10ku6.apigw.ntruss.com/custom/v1/21381/5016de1ec06efb79da71b88d9cf9da89b6e3b486f49b315f647efd90402d226c/general";

type OcrRequestImage = {
  format: "jpg" | "jpeg" | "png" | "pdf" | "tiff";
  name: string;
  data?: any;
  url?: string;
};

// images.data : base64 인코딩 이미지 바이트
// url : 이미지 주소

type OcrRequest = {
  images: OcrRequestImage[];
  lang: "ko" | "ja" | "zh-TW";
  requestId: string;
  resultType: string;
  timestamp: number;
  version: "V1" | "V2";
};

type Vertice = {
  x: number;
  y: number;
};
type OcrResponseImageField = {
  valueType: "ALL";
  boundingPoly: {
    verticies: Vertice[];
  };
  inferText: string;
  inferConfidence: number;
};

type OcrResponseImage = {
  uid: string;
  name: string;
  inferResult: "SUCCESS" | "FAILURE" | "ERROR";
  message: "SUCCESS";
  validationResult: {
    result:
      | "NO_REQUESTED"
      | "UNCHECKED"
      | "ERROR"
      | "VALID"
      | "INVALID"
      | "UNCHECHED";
  };
  fields: OcrResponseImageField[];
};

type OcrResponse = {
  version: "V1" | "V2";
  requestId: string;
  timestamp: number;
  images: OcrResponseImage[];
};
