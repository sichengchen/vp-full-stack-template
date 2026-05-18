import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, listTodos, updateTodo } from "./api";

export const todosQueryOptions = queryOptions({
  queryKey: ["todos"],
  queryFn: listTodos,
});

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryOptions.queryKey });
    },
  });
}

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryOptions.queryKey });
    },
  });
}
