// ---------------------------------------------------------------------------------------------
// ------------------------------  SHOW TIME ---------------------------------------------------
// ---------------------------------------------------------------------------------------------

function showTime() {
  var days = [
    "sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date();
  function time() {
    let currentDate = date.getDate();
    let currentMonth = months[date.getMonth()];
    let currentYear = date.getFullYear();
    let currentTime = date.toLocaleTimeString();
    let currentDay = days[date.getDay()];

    return `${currentDay}&emsp;${currentDate}&nbsp;${currentMonth}&nbsp;${currentYear}&emsp;${currentTime}`;
  }

  $("#currentTime").html(time());
}
showTime();

setInterval(function () {
  showTime();
}, 1000);

var task = $("#taskInput");
let Addbtn = $("#addbtn");
let List = $("#taskList");
let firstClick = true;

task.hide();

// ---------------------------------------------------------------------------------------------
// ------------------------------  Getting empty array or array of eliments  from local storage ------------------------
// ---------------------------------------------------------------------------------------------

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// ---------------------------------------------------------------------------------------------
// ------------------------------  SETTING ELEMENTS INTO LOCAL STORAGE--------------------------
// ---------------------------------------------------------------------------------------------

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------------------------------------------------------------------------------------------
// ------------------------------ Load and display saved tasks on page load --------------------------
// ---------------------------------------------------------------------------------------------

function loadTasksFromLocalStorage() {
  let tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => {
    addTaskToDOM(task.text, task.date, task.time, task.done);
  });
}
loadTasksFromLocalStorage();

// ---------------------------------------------------------------------------------------------
// ------------------------------ ADDING A NEW TASK TO THE LIST -------------------------------
// ---------------------------------------------------------------------------------------------

Addbtn.on("click", function (e) {
  e.preventDefault();

  if (firstClick) {
    task.show(500);
    firstClick = false;
    return; // Exit the function early on first click
  }

  let tasktext = task.val().trim();
  tasktext = tasktext.charAt(0).toUpperCase() + tasktext.slice(1);
  if (tasktext == "") {
    alert("Empty task can't be added");
  } else {
    addTaskToDOM(tasktext);

    // ----------------------------------------------------------
    // -----------SAVE TO LOCAL STORAGE--------------------------
    // ----------------------------------------------------------

    let tasks = getTasksFromLocalStorage();
    tasks.push({
      text: tasktext,
      date: "",
      time: "",
      done: false,
    });
    saveTasksToLocalStorage(tasks);
  }

  task.val("");
});

// ---------------------------------------------------------------------------------------------
// ------------------------------ CREATING DOM ELEMETS AND APPLYING METHODS --------------------------
// ---------------------------------------------------------------------------------------------

function addTaskToDOM(tasktext, taskDate = "", taskTime = "", isDone = false) {
  let finalListitem = $("<li></li>");
  finalListitem.text(tasktext);
  let savebtn = $("<button>Save</button>");
  let delbtn = $("<button>Delete</button>");
  let editbtn = $("<button>Edit</button>");
  let date = $('<input type="date"/>').val(taskDate);
  let time = $('<input type="time"/>').val(taskTime);
  let container = $("<div></div>");
  let checkbox = $('<input type="checkbox">').prop("checked", isDone);

  delbtn.addClass("listdel btn");
  savebtn.addClass("listsave btn");
  editbtn.addClass("listedit btn");
  finalListitem.addClass("listTask");
  checkbox.addClass("checkboxinput");
  date.addClass("datestyle");

  // ---------------------------------------------------------------------------------------------
  // ------------------------------  Save the task with date and time if provided--------------------------
  // ---------------------------------------------------------------------------------------------

  savebtn.click(function () {
    let updatedDate = date.val();
    let updatedTime = time.val();

    // Check if the date/time fields are filled
    if (updatedDate || updatedTime) {
      let tasks = getTasksFromLocalStorage();
      let taskIndex = tasks.findIndex((t) => t.text === tasktext);

      if (taskIndex > -1) {
        tasks[taskIndex].date = updatedDate;
        tasks[taskIndex].time = updatedTime;
        saveTasksToLocalStorage(tasks);
      }
    }
  });

  // ---------------------------------------------------------------------------------------------
  // ------------------------------  DELETE BUTTON--------------------------
  // ---------------------------------------------------------------------------------------------

  delbtn.click(function () {
    finalListitem.remove();

    let tasks = getTasksFromLocalStorage().filter((t) => t.text !== tasktext);
    saveTasksToLocalStorage(tasks);
  });

  // ---------------------------------------------------------------------------------------------
  // ------------------------------  EDIT BUTTON--------------------------
  // ---------------------------------------------------------------------------------------------

  editbtn.click(function () {
    let editedTask = prompt("Enter the edited task:");
    if (editedTask !== null && editedTask.trim() !== "") {
      finalListitem
        .contents()
        .filter(function () {
          return this.nodeType === 3; // text node
        })
        .first() // target the first text node only
        .replaceWith(
          editedTask.trim().charAt(0).toUpperCase() + editedTask.slice(1)
        );
    }

    let tasks = getTasksFromLocalStorage();
    let taskIndex = tasks.findIndex((t) => t.text === tasktext);
    if (taskIndex > -1) {
      tasks[taskIndex].text = editedTask.trim();
      saveTasksToLocalStorage(tasks);
    }
  });

  // ---------------------------------------------------------------------------------------------
  // -----  jQuery event handler for when a checkbox is checked or unchecked--------------------------
  // ---------------------------------------------------------------------------------------------

  checkbox.change(function () {
    let tasks = getTasksFromLocalStorage();
    let taskIndex = tasks.findIndex((t) => t.text === tasktext);
    if (taskIndex > -1) {
      tasks[taskIndex].done = checkbox.is(":checked");
      saveTasksToLocalStorage(tasks);
    }
  });

  // ---------------------------------------------------------------------------------------------
  // -----  DOM ELEMENTS ARE APPENDING TO THE LIST ITEM (buttons)-------------------------
  // ---------------------------------------------------------------------------------------------

  container.append(date);
  container.append(time);
  container.append(savebtn);
  container.append(editbtn);
  container.append(delbtn);

  finalListitem.prepend(checkbox);
  finalListitem.append(container);
  List.append(finalListitem);
}
