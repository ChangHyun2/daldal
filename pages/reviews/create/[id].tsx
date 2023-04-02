import styled from "styled-components";
import s from "csd";
import Header2 from "@/components/layout/Header2";
import { useNaverMapContext } from "@/store/context/NaverMap";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import img from "next/image";
import { useRouter } from "next/router";
import { Course } from "@/data/backend/course";
import { getCourse } from "@/data/axios/course";
import { useAuthContext } from "@/store/context/AuthContext";
import { FEATURES, postReview } from "@/data/axios/review";
import { getCenter } from "@/components/map/naverMap";
import { NextSeo } from "next-seo";

export default function CourseDetail() {
  const { naverMapEnabled } = useNaverMapContext();
  const router = useRouter();
  const { id } = router.query;
  const cardBodyRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [features, setFeatures] = useState<boolean[]>(
    FEATURES.map((f) => false)
  );
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  // init naver map
  useEffect(() => {
    if (!naverMapEnabled) return;
    if (!course) return;
    const fallbackCenter = { x: 37.42829747263545, y: 126.76620435615891 };
    const center = getCenter(course?.points as any) || fallbackCenter;
    const { x, y } = center.x + center.y === 0 ? fallbackCenter : center;

    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(y, x),
      zoom: 13,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: true,
    });

    const handleResize = () => {
      const $card1 = document.querySelector(".card1");
      const $cardBody = cardBodyRef.current;
      const $upload = document.querySelector(".upload") as HTMLDivElement;
      if (!$cardBody) return;
      if (!$card1) return;
      if (!$upload) return;

      const { width } = $card1.getBoundingClientRect();
      const { height, width: cardBodyWidth } =
        $cardBody.getBoundingClientRect();

      map.setSize({
        width: width - 54,
        height: height,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    setMap(map);
    return () => window.removeEventListener("resize", handleResize);
  }, [naverMapEnabled, course]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        if (typeof id !== "string") return;
        const { data, status } = await getCourse(id);
        if (status === 200) {
          setCourse(data);
        } else {
          throw new Error();
        }
      } catch (e) {
        window.alert("코스 불러오기 실패");
      }
    })();
    // setCourse(MOCK_COURSE);
  }, [id, user]);

  const handleUpload = () => {
    const $input = inputRef.current;
    if (!$input) return;

    $input.click();
  };

  const handleChangeImage = (e: any) => {
    const [file] = e.target.files;

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const $img = imageRef.current;
      if (!$img) return;

      $img.src = reader.result as string;
      $img.style.width = "100%";
    });

    reader.readAsDataURL(file);
    setFile(file);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      if (file && content && features.length) {
        const form = new FormData();
        form.append(
          "dto",
          new Blob(
            [
              JSON.stringify({
                content,
                features: features
                  .map((checked, i) => ({ name: FEATURES[i].name, checked }))
                  .filter((f) => f.checked)
                  .map((f) => f.name),
              }),
            ],
            {
              type: "application/json",
            }
          )
        );
        form.append("file", file);

        if (typeof id !== "string") return;
        const { data, status } = await postReview(id, form);
        if (status === 200) {
          router.push(`/reviews/${data.id}`);
        }
      } else {
        window.alert(
          ` ${[
            { value: file, label: "기념 사진" },
            { value: content, label: "한 줄 일기" },
            { value: features.length, label: "코스의 특징" },
          ]
            .filter((_) => !Boolean(_.value))
            .map((_) => _.label)
            .join(",")}을 입력해 주세요.`
        );
      }
    } catch (e) {
      window.alert(e);
    }
  };

  // path => marker, polyline
  useEffect(() => {
    if (!course) return;
    if (!map) return;

    new naver.maps.Polyline({
      map,
      path: course.points,
      strokeColor: "#FF4546",
      strokeWeight: 4,
    });

    course.points.map((p, i) => {
      const startOrEnd = i === 0 || i === course.points.length - 1;
      const color = startOrEnd ? "#0F186C" : "#FF4546";
      const size = startOrEnd ? 14 : 12;

      new naver.maps.Marker({
        position: p,
        map,
        icon: {
          content: `<div style="width:${size}px;height:${size}px;background:#fff;transform:translate(-50%,-50%);border:solid ${color} 3px;border-radius:100%;"></div>`,
        },
      });
    });
  }, [course, map]);

  if (!user) return;

  return (
    <form onSubmit={handleSubmit}>
      <StyledHeader />
      <StyledCourseDetail>
        <div className="cards">
          <div className="card card1">
            <div className="card-head">
              <h1>{course?.name}</h1>
              <div className="date">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="card-body">
              <div className="map">
                <div id="map"></div>
              </div>
            </div>
          </div>
          <div className="card card2">
            <div className="card-head">
              <p>오늘의 러닝을 기념할 사진을 남겨주세요.</p>
            </div>
            <div className="card-body" ref={cardBodyRef}>
              <div className="upload" onClick={handleUpload}>
                <div className="uploader">
                  <img
                    ref={imageRef}
                    src="/icons/camera.svg"
                    alt="upload_camera"
                  />
                  <input
                    onChange={handleChangeImage}
                    ref={inputRef}
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="review">
          <div className="features">
            <p>달린 코스의 특징을 알려주세요</p>
            <ul>
              {features.map((focused, i) => {
                const { name, icon, label } = FEATURES[i];

                return (
                  <li
                    key={name}
                    onClick={() =>
                      setFeatures((prev) =>
                        prev.map((f, j) => (j === i ? !f : f))
                      )
                    }
                  >
                    <img
                      width={64}
                      height={64}
                      src={`/icons/${
                        focused ? "feature_large_red" : "feature_large_gray"
                      }/${icon}.svg`}
                      alt={label}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="diary">
            <div>
              <p>오늘의 러닝은 어떠셨나요?</p>
              <div className="textarea">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <span>{content.length}/50자</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!(features.length && Boolean(content) && Boolean(file))}
            >
              게시하기
            </button>
          </div>
        </div>
      </StyledCourseDetail>
    </form>
  );
}

const StyledCourseDetail = styled.div`
  margin-top: 80px;
  padding: 32px 80px;
  ${s.col};
  justify-content: space-between;
  height: calc(100vh - 80px);

  .cards {
    flex: 1;
    ${s.row}
    align-items:flex-start;

    .card {
      ${s.col}
    }

    .card-head {
      ${s.row};
      align-items: flex-end;
      height: 32px;
      margin-bottom: 16px;
    }

    .card-body {
      flex: 1;
    }

    .card1 {
      ${s.grid8}

      h1 {
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        /* identical to box height, or 133% */

        letter-spacing: -0.023em;

        /* Red/500 */

        color: #ff4546;

        margin-right: 16px;
      }

      .date {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */

        letter-spacing: 0.0056em;

        /* Gray/500 */

        color: #9e9e9e;
      }

      .map {
        ${s.fluid}
        padding-right: 54px;

        #map {
        }
      }
    }

    .card2 {
      ${s.grid4}
      height: 100%;

      p {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */
        letter-spacing: 0.0056em;
      }

      .upload {
        height: 100%;

        .uploader {
          ${s.rowCenter}
          height: 100%;
          background: #eee;
          cursor: pointer;
        }

        input {
          display: none;
        }

        button {
          img {
            cursor: pointer;
          }
          border: none;
        }
      }
    }
  }

  .review {
    ${s.rowSpaceBetween};
    align-items: flex-start;
    margin-top: 24px;

    p {
      color: #222;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 16px;
    }

    .features {
      ul {
        margin: 0 -12px;
        width: 480px;
        ${s.row}
        margin-bottom: -16px;

        li {
          margin: 0 12px;
          border-radius: 50px;
          ${s.colCenter}
          margin-bottom: 16px;
          cursor: pointer;

          div {
            ${s.colCenter}
            color: #757575;
            font-weight: 600;
            font-size: 11px;
            line-height: 14px;

            img {
              margin-bottom: 6px;
            }
          }

          &.focused {
            background: #ff4546;

            div {
              color: white;
            }
          }
        }
      }
    }

    .diary {
      flex: 1;
      height: 100%;
      padding-left: 60px;
      max-width: 600px;
      ${s.col}
      justify-content:space-between;

      .textarea {
        position: relative;
        border: 1px solid #9e9e9e;
        border-radius: 8px;
        width: 100%;
        height: 53px;
      }

      button {
        align-self: flex-end;
        border: none;
        color: white;
        padding: 16px 32px;
        width: 172px;
        height: 52px;
        background: #ff4546;
        border-radius: 16px;
        cursor: pointer;
        &:disabled {
          background: #e0e0e0;
        }
      }
    }

    .textarea {
      border: 1px solid #9e9e9e;
      border-radius: 8px;
      padding: 14px 16px;

      input {
        border: none;
        width: 100%;
        margin-right: 36px;
        height: 100%;
        outline: none;
      }

      span {
        position: absolute;
        bottom: 10px;
        right: 16px;
        font-weight: 600;
        font-size: 11px;
        line-height: 14px;
      }
    }
  }
`;

const StyledHeader = styled(Header2)`
  background: #ff4546;
`;
