import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Provider, createReduxModule } from "hooks-for-redux";

// redux/list.js
const getUniqueId = list =>
  list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1;

const [useList, { addItem, deleteItem }] = createReduxModule(
  "list",
  [
    { id: 1, text: "clean the house" },
    { id: 2, text: "buy milk" }
  ],
  {
    addItem: (list, item) => [...list, { ...item, id: getUniqueId(list) }],
    deleteItem: (list, item) => list.filter(todo => todo.id !== item.id)
  }
);

// components/ToDoItem.js
const ToDoItem = ({ item }) =>
  <li>
    {item.text + " "}
    <button onClick={() => deleteItem(item)}>{" - "}</button>
  </li>

// components/ToDo.js
const ToDo = () => {
  const [text, setText] = useState("");

  const createNewToDoItem = () => {
    if (!text) return alert("Please enter a text!");
    addItem({ text });
    setText("");
  };

  return <div>
    <h1>Todo with hooks-for-redux</h1>
    <ul>
      {useList().map(item => (
        <ToDoItem key={item.id} item={item} />
      ))}
    </ul>

    <input
      type="text"
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyPress={e => e.key === "Enter" && createNewToDoItem()}
    />
    &nbsp;
    <button onClick={createNewToDoItem}>{" + "}</button>
  </div>
};

// index.js
ReactDOM.render(<Provider><ToDo /></Provider>, document.getElementById("root"));