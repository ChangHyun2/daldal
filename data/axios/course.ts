import { Course } from "../backend/course";
import { daldalAxios } from "./instance";

// POST
export type PostCourseRequest = Omit<Course, "id" | "bookamark">;
export type PostCourseResponse = Course;
export const postCourse = (postCourseRequest: PostCourseRequest) => {
  return daldalAxios.post<PostCourseResponse>("/course", postCourseRequest);
};

// GET
export type GetCoursesResponse = Course[];
export const getCourses = () => daldalAxios.get<GetCoursesResponse>("/course");

export type GetCourseResponse = Course;
export const getCourse = (id: Course["id"]) =>
  daldalAxios.get<GetCourseResponse>(`/course/${id}`);

// PATCH
export type PatchCourseResponse = Course;
export type PatchCourseRequest = Partial<Course>;
export const patchCourse = (
  id: string,
  patchCourseRequest: PatchCourseRequest
) =>
  daldalAxios.patch<PatchCourseResponse>(`/course/${id}`, patchCourseRequest);

// DELETE
export const deleteCourse = (id: string) =>
  daldalAxios.delete(`/courses/${id}`);
