export type Token = {
  accessToken: string;
  refreshToken: string;
  accessExpiration: number;
  refreshExpiration: number;
};

export const MOCK_TOKEN: Token = {
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGVtYWlsLmNvbSIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE2ODAxMDIzMTB9.0O_ulMqIeBCxPZHlkgTwZmgfRpAo9aa3MJBrALMVOgi9glFsKBLc9kPXJJddSSX1FaLvvfvFADo-1cjy-eFsDg",
  refreshToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGVtYWlsLmNvbSIsImF1dGgiOiJST0xFX1VTRVIiLCJleHAiOjE2ODAxMDgzMTB9.kaPvOo1-HFLDSYXSADB6lbfXrND2u38Y3yRo5k1d10E60CE9js79tpX5B8wYxPK10O8-J90zXqUBoYeqEs4jRA",
  accessExpiration: 1680102310465,
  refreshExpiration: 1680108310465,
};
