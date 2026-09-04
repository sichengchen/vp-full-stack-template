import { type FormEvent, useRef, useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { List, ListItem } from "@astryxdesign/core/List";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Todo } from "@template/shared";
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

  return (
    <VStack as="section" gap={6}>
      <Heading level={1}>Todos</Heading>

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
          isDisabled={!title.trim()}
          isLoading={createTodo.isPending}
          label="Add"
          type="submit"
          variant="primary"
        />
      </HStack>

      {todos.length > 0 ? (
        <List density={density === "compact" ? "compact" : "spacious"} hasDividers>
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
        <Text color="secondary">No todos.</Text>
      )}
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
