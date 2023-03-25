import { User } from "@/data/backend/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetUserQuery({ id }: Pick<User, "id">) {
  const getUserQuery = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetch(`/user/${id}`).then((res) => res.json()),
  });
}

export function useCreateUserMutation() {
  const createUserMutation = useMutation({
    mutationFn: (userForm) => {
      return fetch("/user", { method: "POST" });
    },
  });
}
export function usePatchUserMutation() {}
export function useDeleteUserMutation() {}
