const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEdit = document.querySelector("#cancel-edit");
const toolbar = document.querySelector("#toolbar");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-search");
const filterBtn = document.querySelector("#filter-select");

let oldInput;

const maxCharacters = 100;

// // Functions
const saveToDos = (text, done = 0, save = 1, id = null) => {
  let displayText = text;
  if (text.length > maxCharacters) {
    displayText = text.substring(0, maxCharacters) + "...";
  }

  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoId = id || Date.now();
  todo.setAttribute("data-id", todoId);

  const todoTitle = document.createElement("h3");
  todoTitle.innerHTML = displayText;
  todo.appendChild(todoTitle);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttons");

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo", "buttons");
  doneBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  buttonContainer.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo", "buttons");
  editBtn.innerHTML = '<i class="fa-solid fa-file-pen"></i>';
  buttonContainer.appendChild(editBtn);

  const deleteBtm = document.createElement("button");
  deleteBtm.classList.add("remove-todo", "buttons");
  deleteBtm.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
  buttonContainer.appendChild(deleteBtm);

  // localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveToDosLocalStorage({ text, done, id: todoId });
  }

  todo.appendChild(buttonContainer);
  todoList.appendChild(todo);
  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  todoForm.classList.toggle("hide");
  editForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
  toolbar.classList.toggle("hide");
};

const updateToDo = (newText, editing) => {
  const todoTitle = editing.querySelector("h3");
  todoTitle.innerText = newText;

  const todoId = editing.getAttribute("data-id");
  const todos = getToDosLocalStorage();

  const updatedTodos = todos.map((todo) => {
    if (todo.id === Number(todoId)) {
      return { ...todo, text: newText };
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
};

const getSearch = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    if (!todoTitle.includes(normalizedSearch)) {
      todo.classList.add("hide");
    }

    if (todoTitle.includes(normalizedSearch)) {
      todo.classList.remove("hide");
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => {
        todo.classList.remove("hide");
      });
      break;

    case "done":
      todos.forEach((todo) => {
        if (!todo.classList.contains("done")) {
          todo.classList.add("hide");
        } else {
          todo.classList.remove("hide");
        }
      });
      break;

    case "undone":
      todos.forEach((todo) => {
        if (todo.classList.contains("done")) {
          todo.classList.add("hide");
        } else {
          todo.classList.remove("hide");
        }
      });
  }
};

// Events
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;

  if (inputValue) {
    saveToDos(inputValue);
  }
});

cancelEdit.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

todoList.addEventListener("click", (e) => {
  const targetElement = e.target;
  const parentElement = targetElement.closest(".todo");

  if (!parentElement) return;

  const todoId = Number(parentElement.getAttribute("data-id"));

  if (targetElement.classList.contains("finish-todo")) {
    parentElement.classList.toggle("done");

    const todos = getToDosLocalStorage();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  if (targetElement.classList.contains("remove-todo")) {
    removeToDosLocalStorage(todoId);
    parentElement.remove();
  }

  if (targetElement.classList.contains("edit-todo")) {
    toggleForms();
    const todoTitle = parentElement.querySelector("h3").innerText;
    editInput.value = todoTitle;
    parentElement.classList.add("editing");
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = editInput.value;
  const editing = document.querySelector(".editing");

  if (inputValue && editing) {
    updateToDo(inputValue, editing);
    editing.classList.remove("editing");
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearch(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// localStorage
const getToDosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const loadToDosLocalStorage = () => {
  const todos = getToDosLocalStorage();

  todos.forEach((todo) => {
    saveToDos(todo.text, todo.done, 0);
  });
};

const saveToDosLocalStorage = (todo) => {
  const todos = getToDosLocalStorage();
  const existingTodo = todos.find((t) => t.id === todo.id);
  if (existingTodo) {
    existingTodo.text = todo.text;
    existingTodo.done = todo.done;
  } else {
    todos.push(todo);
  }

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeToDosLocalStorage = (id) => {
  let todos = getToDosLocalStorage();
  todos = todos.filter((todo) => todo.id !== id);
  localStorage.setItem("todos", JSON.stringify(todos));
};

loadToDosLocalStorage();
