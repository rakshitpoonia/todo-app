document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addtaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");
  const clearCompletedBtn = document.getElementById("clear-completed");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Initial render - show tasks or empty state
  updateEmptyState();
  tasks.forEach((task) => {
    renderTask(task);
  });

  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = ""; // clear input
    updateEmptyState();
    console.log(tasks);
  }

  addtaskButton.addEventListener("click", () => {
    addTask();
  });

  // Enter key event listener
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Read from local storage
  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.classList.add("todo-item");

    // Add completed class if task is completed
    if (task.completed) {
      li.classList.add("completed");
    }
    li.innerHTML = `
    <div class="todo-checkbox ${task.completed ? "checked" : ""}"></div>
    <span class=todo-text>${task.text}</span>
    <button class=delete-btn>delete</button>
    `;

    // on clicking li class changes to 'completed' which changes CSS Styling
    li.addEventListener("click", (e) => {
      // to ensure this happens on clicking li and not delete button
      if (
        e.target.tagName === "BUTTON" ||
        e.target.classList.contains("todo-checkbox")
      )
        return;
      task.completed = !task.completed;
      li.classList.toggle("completed");

      // Update checkbox visual state
      const checkbox = li.querySelector(".todo-checkbox");
      checkbox.classList.toggle("checked");

      saveTasks();
      updateClearCompletedButton();
    });

    // Checkbox click event
    li.querySelector(".todo-checkbox").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent li click from firing
      task.completed = !task.completed;
      li.classList.toggle("completed");

      // Update checkbox visual state
      const checkbox = li.querySelector(".todo-checkbox");
      checkbox.classList.toggle("checked");

      saveTasks();
      updateClearCompletedButton();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); //Prevent toggle from firing

      // in array every task id that is not equal to deleted task id gets filtered and stored in tasks
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
      updateEmptyState(); //Update Empty state after deleting task
      updateClearCompletedButton();
    });

    todoList.appendChild(li);
  }

  // Event listener for clear completed button
  clearCompletedBtn.addEventListener("click", () => {
    // this will store all non completed tasks
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    // Clear all tasks from DOM and re-render non completed tasks
    todoList.innerHTML = "";
    updateEmptyState();
    tasks.forEach((task) => {
      renderTask(task);
    });
  });

  // Function to show/hide clear button
  function updateClearCompletedButton() {
    const hasCompletedTasks = tasks.some((task) => task.completed);
    if (hasCompletedTasks && tasks.length > 0) {
      clearCompletedBtn.style.display = "block";
    } else {
      clearCompletedBtn.style.display = "none";
    }
  }

  // Function to update empty state visibility
  function updateEmptyState() {
    if (tasks.length === 0) {
      // Check if the empty state element still exists in the DOM
      const currentEmptyState = document.getElementById("empty-state");
      if (!currentEmptyState) {
        // It's gone! Create a new one
        const emptyStateHTML = `
        <div class="empty-state" id="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-text">No tasks yet</div>
          <div class="empty-state-subtext">Add your first task to get started!</div>
        </div>
      `;
        todoList.innerHTML = emptyStateHTML;
      } else {
        // It exists, just show it
        currentEmptyState.style.display = "block";
      }
    } else {
      // Always get fresh reference to empty state element
      const currentEmptyState = document.getElementById("empty-state");
      if (currentEmptyState) {
        currentEmptyState.style.display = "none";
      }
    }
    updateClearCompletedButton();
  }

  // to save tasks in local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
