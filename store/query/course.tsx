import {
  PatchCourseRequest,
  PostCourseRequest,
  deleteCourse,
  getCourses,
  patchCourse,
  postCourse,
} from "@/data/axios/course";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCoursesQuery = () =>
  useQuery({
    queryKey: ["Courses"],
    queryFn: getCourses,
  });

export const useCreateCourseMutation = () =>
  useMutation({
    mutationFn: (postCourseRequest: PostCourseRequest) =>
      postCourse(postCourseRequest),
  });

export const usePatchCourseMutation = () =>
  useMutation({
    mutationFn: ({
      id,
      patchCourseRequest,
    }: {
      id: string;
      patchCourseRequest: PatchCourseRequest;
    }) => patchCourse(id, patchCourseRequest),
  });

export const useDeleteCourseMutation = () =>
  useMutation({
    mutationFn: (id: string) => deleteCourse(id),
  });
