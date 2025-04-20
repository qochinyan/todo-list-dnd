import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Todo, setTodos } from "../../redux/todoSlice";
import TodoItem from "../TodoItem/TodoItem";
import { useState, useEffect } from "react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import styles from "./TodoList.module.scss";

type FilterType = "all" | "active" | "completed";

const TodoList = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);

  const [filtering, setFiltering] = useState<FilterType>("all");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const getFilteredTodos = (): Todo[] => {
    if (filtering === "active") return todos.filter((todo) => !todo.completed);
    if (filtering === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  };

  useEffect(() => {
    setFilteredTodos(getFilteredTodos());
  }, [todos, filtering]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTodos.findIndex((todo) => todo.id === active.id);
    const newIndex = filteredTodos.findIndex((todo) => todo.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updated = arrayMove(filteredTodos, oldIndex, newIndex);

    const fullListUpdated = [...todos];

    updated.forEach((todo, i) => {
      const indexInFull = fullListUpdated.findIndex((t) => t.id === todo.id);
      if (indexInFull !== -1) {
        fullListUpdated.splice(indexInFull, 1);
        fullListUpdated.splice(i, 0, todo);
      }
    });

    dispatch(setTodos(fullListUpdated));

    setFilteredTodos(getFilteredTodos());
  };

  return (
    <div className={styles["todo-list"]}>
      <div className={styles["todo-list__filters"]}>
        <button
          className={`${styles["todo-list__button"]} ${filtering === "all" ? styles["todo-list__button--active"] : ""}`}
          onClick={() => setFiltering("all")}
        >
          Все
        </button>
        <button
          className={`${styles["todo-list__button"]} ${
            filtering === "active" ? styles["todo-list__button--active"] : ""
          }`}
          onClick={() => setFiltering("active")}
        >
          Активные
        </button>
        <button
          className={`${styles["todo-list__button"]} ${
            filtering === "completed" ? styles["todo-list__button--active"] : ""
          }`}
          onClick={() => setFiltering("completed")}
        >
          Завершённые
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
          <ul className={styles["todo-list__list"]}>
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList;
