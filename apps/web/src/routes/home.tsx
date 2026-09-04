import { type FormEvent, useRef, useState } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { List, ListItem } from "@astryxdesign/core/List";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Todo } from "@template/shared";
import { PlusIcon } from "lucide-react";
import { todosQueryOptions, useCreateTodoMutation, useUpdateTodoMutation } from "../lib/todos";
import { usePreferencesStore } from "../stores/preferences";

export function HomePage() {
  const [title, setTitle] = useState("");
  const density = usePreferencesStore((state) => state.density);
  const { data: todos } = useSuspenseQuery(todosQueryOptions);
  const createTodo = useCreateTodoMutation();
  const updateTodo = useUpdateTodoMutation();

  function handleSubmit(event: FormEvent<HTMLElement>) {
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
    <VStack as="section" gap={6}>
      <VStack gap={2} hAlign="start">
        <Text color="secondary" type="supporting">
          Full stack example
        </Text>
        <Heading level={1}>Template todos</Heading>
        <Text as="p" color="secondary">
          This page reads and writes todos through Hono, Drizzle, TanStack Query, and a proxied Vite
          development server.
        </Text>
      </VStack>

      <Card padding={6} width="100%">
        <VStack gap={5}>
          <HStack align="center" gap={3} justify="between" wrap="wrap">
            <VStack gap={1}>
              <Heading level={2}>Todo workflow</Heading>
              <Text color="secondary">Create tasks and check them off as you go.</Text>
            </VStack>
            <Badge label={`${completedCount} of ${todos.length} completed`} />
          </HStack>

          <HStack as="form" align="end" gap={3} onSubmit={handleSubmit} wrap="wrap">
            <StackItem size="fill">
              <TextInput
                isLabelHidden
                label="Todo title"
                onChange={setTitle}
                placeholder="Add a todo"
                value={title}
                width="100%"
              />
            </StackItem>
            <Button
              icon={<PlusIcon />}
              isDisabled={!title.trim()}
              isLoading={createTodo.isPending}
              label="Add"
              type="submit"
              variant="primary"
            />
          </HStack>

          {todos.length > 0 ? (
            <List
              density={density === "compact" ? "compact" : "spacious"}
              hasDividers
              header={<Text weight="semibold">Todos</Text>}
            >
              {todos.map((todo) => (
                <TodoRow
                  key={todo.id}
                  density={density}
                  onToggle={async (completed) => {
                    await updateTodo.mutateAsync({ id: todo.id, completed });
                  }}
                  todo={todo}
                />
              ))}
            </List>
          ) : (
            <EmptyState
              description="Add your first task with the field above."
              headingLevel={3}
              isCompact
              title="No todos yet"
            />
          )}
        </VStack>
      </Card>
    </VStack>
  );
}

type TodoRowProps = {
  density: "comfortable" | "compact";
  onToggle: (completed: boolean) => Promise<void>;
  todo: Todo;
};

function TodoRow({ density, onToggle, todo }: TodoRowProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  return (
    <ListItem
      interactiveRef={checkboxRef}
      label={
        <Text color={todo.completed ? "secondary" : "primary"} hasStrikethrough={todo.completed}>
          {todo.title}
        </Text>
      }
      startContent={
        <CheckboxInput
          ref={checkboxRef}
          changeAction={onToggle}
          isLabelHidden
          label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
          size={density === "compact" ? "sm" : "md"}
          value={todo.completed}
        />
      }
    />
  );
}
