import { Pagination } from "@/data/backend/pagination";
import { Review, ReviewFeature, ReviewSentiment } from ".";
import { daldalAxios } from "../instance";
import { AxiosResponse } from "axios";

export const getReviewFilter = (
  getReviewFilterRequest: GetReviewFilterRequest
) => {
  const { dto, page, size } = getReviewFilterRequest;

  return daldalAxios.post<GetReviewFilterResponse>("/review/filter", dto, {
    params: {
      page,
      size,
    },
  });
};

export type GetReviewFilterRequest = {
  page: number;
  size: number;
  dto: {
    features: ReviewFeature[];
  };
};

export type GetReviewFilterResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Review[];
  number: number;
  sort: {
    empty: true;
    sorted: true;
    unsorted: true;
  };
  pageable: {
    offset: number;
    sort: {
      empty: true;
      sorted: true;
      unsorted: true;
    };
    pageNumber: number;
    pageSize: number;
    paged: true;
    unpaged: true;
  };
  numberOfElements: number;
  first: true;
  last: true;
  empty: true;
};
