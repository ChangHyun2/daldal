import { Member } from "@/data/backend/member";
import { daldalAxios } from "../instance";
import { Course } from "@/data/backend/course";
import { Comment } from "@/data/backend/comment";

export const SENTIMENTS = [
  { name: "POSITIVE", label: "상쾌해요" },
  { name: "NEUTRAL", label: "그냥그래요" },
  { name: "NEGATIVE", label: "지쳤어요" },
] as const;
export type ReviewSentiment = (typeof SENTIMENTS)[number]["name"];

export const FEATURES = [
  { name: "TOILET", icon: "public_toilet", label: "화장실" },
  { name: "CAFE", icon: "cafe", label: "카페" },
  { name: "STORE", icon: "convenience_store", label: "편의점" },
  { name: "SAFE", icon: "safe", label: "안전" },
  { name: "CONSTRUCTION", icon: "construction", label: "공사" },
  { name: "SLOPE", icon: "hill", label: "언덕" },
  { name: "FLAT", icon: "flat", label: "평지" },
  { name: "PAVED", icon: "road", label: "포장도로" },
  { name: "UNPAVED", icon: "trail", label: "비포장도로" },
  { name: "TRAFFIC", icon: "traffic_light", label: "횡단보도" },
] as const;

export type ReviewFeature = (typeof FEATURES)[number]["name"];

export type Review = {
  [x: string]: any;
  id: string;
  member: Member;
  course: Course;
  content: string;
  imageUrl: string;
  favourite: number;
  sentiment: ReviewSentiment;
  isFavorite: true;
  isBookmarked: true;
  features: ReviewFeature[];
  comments: Comment[];
  createAt: string;
};

export type PostReviewRequest = FormData;
export const postReview = (
  courseId: string,
  postReviewRequest: PostReviewRequest
) =>
  daldalAxios.post<PostReviewResponse>(
    `/review/with/modelattribute/${courseId}`,
    postReviewRequest,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );

export type PostReviewResponse = {
  id: string;
  memberId: string;
  courseId: string;
  content: string;
  favorite: number;
  imageUrl: string;
  sentiment: ReviewSentiment;
  features: ReviewFeature[];
};

export const getReview = (id: string) =>
  daldalAxios.get<Review>(`/review/${id}`);

export const getMyReview = () => daldalAxios.get<Review[]>(`/review`);
