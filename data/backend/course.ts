export type CoursePoint = Pick<naver.maps.LatLng, "x" | "y"> & {
  reverseGeocodeResponse?: naver.maps.Service.ReverseGeocodeResponse;
};

export type Course = {
  id: string;
  name: string;
  distance: number;
  duration: number;
  bookamark: number;
  points: CoursePoint[];
};

export const MOCK_COURSE: Course = {
  id: "64257d917ee9211490eaede7",
  name: "test course1",
  distance: 1234,
  duration: 4321,
  bookamark: 123,
  points: [
    {
      y: 37.3670744,
      _lat: 37.3670744,
      x: 127.1095189,
      _lng: 127.1095189,
      reverseGeocodeResponse: {
        v2: {
          status: {
            code: 0,
            name: "ok",
            message: "done",
          },
          results: [
            {
              name: "legalcode",
              code: {
                id: "4113510300",
                type: "L",
                mappingId: "02135103",
              },
              region: {
                area0: {
                  name: "kr",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
                area1: {
                  name: "경기도",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.550802,
                      y: 37.4363177,
                    },
                  },
                  alias: "경기",
                },
                area2: {
                  name: "성남시 분당구",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1189255,
                      y: 37.3828195,
                    },
                  },
                },
                area3: {
                  name: "정자동",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1115333,
                      y: 37.3614503,
                    },
                  },
                },
                area4: {
                  name: "",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
              },
            },
            {
              name: "admcode",
              code: {
                id: "4113554500",
                type: "S",
                mappingId: "02135103",
              },
              region: {
                area0: {
                  name: "kr",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
                area1: {
                  name: "경기도",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.550802,
                      y: 37.4363177,
                    },
                  },
                  alias: "경기",
                },
                area2: {
                  name: "성남시 분당구",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1189255,
                      y: 37.3828195,
                    },
                  },
                },
                area3: {
                  name: "정자동",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1115333,
                      y: 37.3614503,
                    },
                  },
                },
                area4: {
                  name: "",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
              },
            },
          ],
          address: {
            jibunAddress: "경기도 성남시 분당구 정자동  ",
            roadAddress: "",
          },
        },
      },
    },
    {
      y: 37.3670744,
      _lat: 37.3670744,
      x: 127.1095189,
      _lng: 127.1095189,
      reverseGeocodeResponse: {
        v2: {
          status: {
            code: 0,
            name: "ok",
            message: "done",
          },
          results: [
            {
              name: "legalcode",
              code: {
                id: "4113510300",
                type: "L",
                mappingId: "02135103",
              },
              region: {
                area0: {
                  name: "kr",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
                area1: {
                  name: "경기도",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.550802,
                      y: 37.4363177,
                    },
                  },
                  alias: "경기",
                },
                area2: {
                  name: "성남시 분당구",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1189255,
                      y: 37.3828195,
                    },
                  },
                },
                area3: {
                  name: "정자동",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1115333,
                      y: 37.3614503,
                    },
                  },
                },
                area4: {
                  name: "",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
              },
            },
            {
              name: "admcode",
              code: {
                id: "4113554500",
                type: "S",
                mappingId: "02135103",
              },
              region: {
                area0: {
                  name: "kr",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
                area1: {
                  name: "경기도",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.550802,
                      y: 37.4363177,
                    },
                  },
                  alias: "경기",
                },
                area2: {
                  name: "성남시 분당구",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1189255,
                      y: 37.3828195,
                    },
                  },
                },
                area3: {
                  name: "정자동",
                  coords: {
                    center: {
                      crs: "EPSG:4326",
                      x: 127.1115333,
                      y: 37.3614503,
                    },
                  },
                },
                area4: {
                  name: "",
                  coords: {
                    center: {
                      crs: "",
                      x: 0,
                      y: 0,
                    },
                  },
                },
              },
            },
          ],
          address: {
            jibunAddress: "경기도 성남시 분당구 정자동  ",
            roadAddress: "",
          },
        },
      },
    },
  ] as any,
};
