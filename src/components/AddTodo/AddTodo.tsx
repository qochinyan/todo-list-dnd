import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { addTodo } from "../../redux/todoSlice";
import "./AddTodo.scss";

const AddTodo = () => {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText("");
    }
  };

  return (
    <div className="add-todo">
      <input
        className="add-todo__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача"
      />
      <button className="add-todo__button" onClick={handleAdd}>
        Добавить
      </button>
    </div>
  );
};

export default AddTodo;
