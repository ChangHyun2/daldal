import { Review } from ".";
import { daldalAxios } from "../instance";

export const getReviewPopular = () =>
  daldalAxios.get<Review[]>("/review/popular");
