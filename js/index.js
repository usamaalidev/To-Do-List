// &=========> HTML Elements

var root = document.querySelector(":root");
var body = document.body;
var modal = document.getElementById("modal");
var titleInput = document.getElementById("title");
var statusInput = document.getElementById("status");
var categoryInput = document.getElementById("category");
var descriptionInput = document.getElementById("description");
var addBtn = document.getElementById("addBtn");
var newTaskBtn = document.getElementById("newTask");

var nextUpTasksContainer = document.getElementById("toDo");
var inProgressTasksContainer = document.getElementById("inProgress");
var doneTasksContainer = document.getElementById("done");

var gridBtn = document.getElementById("gridBtn");
var barsBtn = document.getElementById("barsBtn");

var nextUpCountElement = document.getElementById("nextUpCount");
var inProgressCountElement = document.getElementById("inProgressCount");
var doneCountElement = document.getElementById("doneCount");

var searchInput = document.getElementById("searchInput");

var sections = document.querySelectorAll("section");
var tasksContainer = document.querySelectorAll(".tasks");

var remainingCounterElement = document.getElementById("remainingCounter");

var modeBtn = document.getElementById("mode");

// &=========> App variables

var tasks = [];
var taskHTML = "";
var updatedIndex;
var nextUpCount = 0;
var inProgressCount = 0;
var doneCount = 0;
var remainingCounter = 100;

// ^=====> Regular Expressions

var titleRegex = /^\w{3,}(\s\w+)*$/;
var descriptionRegex = /^\w{5,100}$/;

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  for (var i = 0; i < tasks.length; i++) {
    displayTasks(i);
  }
}

// &=========> Functions

function showModal() {
  modal.classList.add("d-flex");
  modal.classList.remove("d-none");
  scroll(0, 0);
  body.style.overflow = "hidden";
}

function hideModal() {
  modal.classList.add("d-none");
  modal.classList.remove("d-flex");
  body.style.overflow = "auto";

  addBtn.innerHTML = "Add Task";
  addBtn.classList.remove("btn-update");
  addBtn.classList.add("btn-new-task");
}

function addTask() {
  if (
    validate(titleRegex, titleInput) &&
    validate(descriptionRegex, descriptionInput)
  ) {
    if (addBtn.innerHTML.trim() == "Add Task") {
      var task = {
        status: statusInput.value,
        category: categoryInput.value,
        title: titleInput.value,
        description: descriptionInput.value,
      };

      tasks.push(task);
      saveTasksToLocal();

      displayTasks(tasks.length - 1);
      resetInputs();
      hideModal();
    } else if (addBtn.innerHTML == "Update Task") {
      updateTask(updatedIndex);
    }
  }
}

function displayTasks(index) {
  taskHTML = `
      <div class="task">
        <h3 class="text-capitalize">${tasks[index]?.title}</h3>
        <p class="description text-capitalize">${tasks[index]?.description}</p>
        <h4 class="category ${tasks[index]?.category} text-capitalize">${tasks[index]?.category}</h4>
        <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
          <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
          <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
          <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
        </ul>
    </div>
    `;

  setHTMLocation(tasks[index]?.status);
}

function setHTMLocation(status) {
  switch (status) {
    case "nextUp":
      nextUpTasksContainer.innerHTML += taskHTML;
      nextUpCount++;
      nextUpCountElement.innerHTML = nextUpCount;
      break;
    case "inProgress":
      inProgressTasksContainer.innerHTML += taskHTML;
      inProgressCount++;
      inProgressCountElement.innerHTML = inProgressCount;
      break;
    case "done":
      doneTasksContainer.innerHTML += taskHTML;
      doneCount++;
      doneCountElement.innerHTML = doneCount;
      break;
  }
}

function saveTasksToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocal();
  resetTasksContainer();
  resetCount();
  for (var i = 0; i < tasks.length; i++) {
    displayTasks(i);
  }
}

function getTaskInfo(index) {
  showModal();
  statusInput.value = tasks[index].status;
  categoryInput.value = tasks[index].category;
  titleInput.value = tasks[index].title;
  descriptionInput.value = tasks[index].description;

  addBtn.innerHTML = "Update Task";
  addBtn.classList.remove("btn-new-task");
  addBtn.classList.add("btn-update");
  updatedIndex = index;
}

function updateTask(index) {
  tasks[index].status = statusInput.value;
  tasks[index].category = categoryInput.value;
  tasks[index].title = titleInput.value;
  tasks[index].description = descriptionInput.value;

  saveTasksToLocal();
  resetTasksContainer();
  resetCount();

  for (var i = 0; i < tasks.length; i++) {
    displayTasks(i);
  }

  resetInputs();
  addBtn.innerHTML = "Add Task";
  addBtn.classList.remove("btn-update");
  addBtn.classList.add("btn-new-task");
  hideModal();
}

function generateColor() {
  var color = "#";
  var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  for (var i = 1; i <= 6; i++) {
    var randonIndex = Math.trunc(Math.random() * 16);
    color += chars[randonIndex];
  }
  return color + "aa";
}

function changeColor(e) {
  var taskCard = e.target.parentElement.parentElement.parentElement;
  taskCard.style.backgroundColor = generateColor();
}

function searchTask() {
  resetTasksContainer();
  resetCount();
  var searchKey = searchInput.value;
  for (var i = 0; i < tasks.length; i++) {
    if (
      tasks[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
      tasks[i].category.toLowerCase().includes(searchKey.toLowerCase())
    ) {
      displayTasks(i);
    }
  }
}

function resetInputs() {
  statusInput.value = "nextUp";
  categoryInput.value = "education";
  titleInput.value = "";
  descriptionInput.value = "";
}

function resetCount() {
  nextUpCount = 0;
  inProgressCount = 0;
  doneCount = 0;
  nextUpCountElement.innerHTML = nextUpCount;
  inProgressCountElement.innerHTML = inProgressCount;
  doneCountElement.innerHTML = doneCount;
}

function resetTasksContainer() {
  nextUpTasksContainer.innerHTML = "";
  inProgressTasksContainer.innerHTML = "";
  doneTasksContainer.innerHTML = "";
}

function changeToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }

  for (var j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].setAttribute("data-view", "bars");
  }
}

function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-md-6", "col-lg-4");
  }

  for (var j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].removeAttribute("data-view");
  }
}

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-none",
      "d-block"
    );
  }

  return regex.test(element.value);
}

function changeMode() {
  if (modeBtn.dataset.mode == "night") {
    root.style.setProperty("--main-black", "#f1f1f1");
    root.style.setProperty("--sec-black", "#ddd");
    root.style.setProperty("--text-color", "#222");
    root.style.setProperty("--gray-color", "#333");
    root.style.setProperty("--mid-gray", "#f1f1f1");
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    modeBtn.dataset.mode = "light";
  } else if (modeBtn.dataset.mode == "light") {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
    root.style.setProperty("--gray-color", "#dadada");
    root.style.setProperty("--mid-gray", "#474a4e");
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    modeBtn.dataset.mode = "night";
  }
}

newTaskBtn.addEventListener("click", showModal);
addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", searchTask);
barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid);
modal.addEventListener("click", function (event) {
  if (event.target.id == "modal") {
    hideModal();
  }
});

modeBtn.addEventListener("click", changeMode);

titleInput.addEventListener("input", function () {
  validate(titleRegex, titleInput);
});

descriptionInput.addEventListener("input", function () {
  validate(descriptionRegex, descriptionInput);
  remainingCounter = 100 - descriptionInput.value.split("").length;
  remainingCounterElement.innerHTML = remainingCounter;
});
