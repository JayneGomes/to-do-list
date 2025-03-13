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
const saveToDos = (text) => {
  let displayText = text;
  if (text.length > maxCharacters) {
    displayText = text.substring(0, maxCharacters) + "...";
  }

  const todo = document.createElement("div");
  todo.classList.add("todo");

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
};

const getSearch = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    if (!todoTitle.includes(normalizedSearch)) {
      todo.classList.add("hide");
      //   todo.style.display = "none";
    }

    if (todoTitle.includes(normalizedSearch)) {
      todo.classList.remove("hide");
      //   todo.style.display = "none";
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

  const todoTitle = parentElement.querySelector("h3").innerText;

  if (targetElement.classList.contains("finish-todo")) {
    parentElement.classList.toggle("done");
  }

  if (targetElement.classList.contains("remove-todo")) {
    parentElement.remove();
  }

  if (targetElement.classList.contains("edit-todo")) {
    toggleForms();
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
