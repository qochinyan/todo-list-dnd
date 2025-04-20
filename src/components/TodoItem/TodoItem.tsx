import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, toggleTodo, deleteTodo, editTodo } from "../../redux/todoSlice";
import { useAppDispatch } from "../../hooks/hooks";
import { useState } from "react";
import "./TodoItem.scss";

type Props = {
  todo: Todo;
};

const TodoItem = ({ todo }: Props) => {
  const dispatch = useAppDispatch();

  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() !== "" && editText !== todo.text) {
      dispatch(editTodo({ id: todo.id, text: editText.trim() }));
    }
    setIsEditing(false);
  };

  return (
    <li ref={setNodeRef} style={style} className="todo-item">
      <span className="todo-item__drag" {...attributes} {...listeners}>
        ☰
      </span>

      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch(toggleTodo(todo.id))}
      />

      {isEditing ? (
        <input
          className="todo-item__edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <span
          className={`todo-item__text ${todo.completed ? "todo-item__text--completed" : ""}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}

      <button className="todo-item__delete" onClick={() => dispatch(deleteTodo(todo.id))}>
        ❌
      </button>
    </li>
  );
};

export default TodoItem;
