import "./App.scss";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";

function App() {
  return (
    <div className="app__container">
      <h1>Todo List</h1>
      <AddTodo  />
      <TodoList />
    </div>
  );
}

export default App;
