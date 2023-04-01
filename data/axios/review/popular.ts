import { Comment } from "@/data/backend/comment";
import { Review } from ".";
import { daldalAxios } from "../instance";

export const getReviewPopular = () =>
  daldalAxios.get<Review[]>("/review/popular");
