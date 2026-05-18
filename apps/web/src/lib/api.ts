import type { CreateTodoInput, Todo, UpdateTodoInput } from "@template/shared";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function listTodos() {
  return apiRequest<Todo[]>("/api/todos");
}

export function createTodo(input: CreateTodoInput) {
  return apiRequest<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTodo(id: string, input: UpdateTodoInput) {
  return apiRequest<Todo>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
