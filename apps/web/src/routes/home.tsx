import { FormEvent, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { Badge } from "@template/ui/components/badge";
import { Button } from "@template/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@template/ui/components/card";
import { Input } from "@template/ui/components/input";
import { cn } from "@template/ui/lib/utils";
import { todosQueryOptions, useCreateTodoMutation, useUpdateTodoMutation } from "../lib/todos";
import { usePreferencesStore } from "../stores/preferences";

export function HomePage() {
  const [title, setTitle] = useState("");
  const density = usePreferencesStore((state) => state.density);
  const { data: todos } = useSuspenseQuery(todosQueryOptions);
  const createTodo = useCreateTodoMutation();
  const updateTodo = useUpdateTodoMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createTodo.mutate(
      { title },
      {
        onSuccess: () => setTitle(""),
      },
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">Full stack example</Badge>
        <h1 className="text-3xl font-semibold tracking-normal">Template todos</h1>
        <p className="text-muted-foreground max-w-2xl">
          This page reads and writes todos through Hono, Drizzle, TanStack Query, and a proxied Vite
          development server.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo workflow</CardTitle>
          <CardDescription>
            {completedCount} of {todos.length} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add a todo"
              aria-label="Todo title"
            />
            <Button type="submit" disabled={!title.trim() || createTodo.isPending}>
              {createTodo.isPending ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : (
                <PlusIcon data-icon="inline-start" />
              )}
              Add
            </Button>
          </form>

          <div className="flex flex-col gap-2">
            {todos.map((todo) => (
              <button
                key={todo.id}
                type="button"
                className={cn(
                  "hover:bg-accent flex w-full items-center justify-between gap-4 rounded-md border px-4 text-left transition-colors",
                  density === "compact" ? "py-2" : "py-3",
                )}
                onClick={() =>
                  updateTodo.mutate({
                    id: todo.id,
                    completed: !todo.completed,
                  })
                }
              >
                <span
                  className={cn("text-sm", todo.completed && "text-muted-foreground line-through")}
                >
                  {todo.title}
                </span>
                {todo.completed ? (
                  <CheckIcon data-icon="inline-end" className="text-primary" />
                ) : null}
              </button>
            ))}
            {todos.length === 0 ? (
              <div className="text-muted-foreground rounded-md border border-dashed p-6 text-sm">
                No todos yet.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
