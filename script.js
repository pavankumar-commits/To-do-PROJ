let taskId = 0;

// Load saved tasks
window.onload = function () {
  loadTasks();
};

function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (value === "") return;

  createTask(value, "todo");
  saveTasks();
  input.value = "";
}

function createTask(text, columnId, id = null) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  const taskID = id || "task-" + taskId++;
  task.id = taskID;

  task.ondragstart = drag;

  task.innerHTML = `
    <p>${text}</p>
    <button onclick="deleteTask('${taskID}')">🗑️Delete</button>
  `;

  document.getElementById(columnId).appendChild(task);
}

function deleteTask(id) {
  document.getElementById(id).remove();
  saveTasks();
}

// Drag functions
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  const data = ev.dataTransfer.getData("text");
  const task = document.getElementById(data);

  // Move task to new column
  ev.currentTarget.appendChild(task);

  // Get column id (todo / progress / done)
  const columnId = ev.currentTarget.id;

  // Get text inside task
  const textElement = task.querySelector("p");

  // Remove old symbols (if any)
  textElement.innerText = textElement.innerText.replace(/^[⏳✅]\s*/, "");

  // Add symbol based on column
  if (columnId === "progress") {
    textElement.innerText = "⏳ " + textElement.innerText;
  } else if (columnId === "done") {
    textElement.innerText = "✅ " + textElement.innerText;
  }

  // Save updated tasks
  saveTasks();
}

// Save to local storage
function saveTasks() {
  const columns = ["todo", "progress", "done"];
  let data = {};

  columns.forEach(col => {
    const tasks = [];
    document.querySelectorAll(`#${col} .task`).forEach(task => {
      tasks.push({
        id: task.id,
        text: task.querySelector("p").innerText
      });
    });
    data[col] = tasks;
  });

  localStorage.setItem("tasks", JSON.stringify(data));
}

// Load from local storage
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks"));
  if (!data) return;

  Object.keys(data).forEach(col => {
    data[col].forEach(task => {
      createTask(task.text, col, task.id);
    });
  });
}