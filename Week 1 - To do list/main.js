const form = document.getElementById("todo_list");

// Template text: "lroem", date: d/m/y", time: "hr:mnAM/PM"
let todo_items = {};
let current_list = null;
let itemIDLogger = localStorage.getItem("itemIDLogger") || 0;

// + button at the bottom of the list functionality
function add_item() {
  const list_id = itemIDLogger++;
  localStorage.setItem("itemIDLogger", itemIDLogger);

  if (document.querySelector("#editItem")) {
    // prevents adding new item while editing... idk why i felt to  add this but i just think its safer
    alert("Can not make new item while editing another");
    return;
  }
  if (!current_list) {
    alert("Please enter a list title before adding items.");
    return;
  }

  const checkItem = document.getElementById("new_item");
  if (checkItem) {
    console.error("Element with ID 'new_item' exists.");

    return;
  }

  const addBtn = document.getElementById("add_item");
  const todo_list = document.getElementById("todo_list");
  const item = document.createElement("div");
  const item_info = document.createElement("div");
  const item_actions = document.createElement("div");
  const item_text = document.createElement("input");
  const item_date = document.createElement("input");
  const item_delete = document.createElement("button");
  const item_time = document.createElement("input");

  item.id = "new_item";
  item.className = "item";
  item_info.className = "item-info";
  item_actions.className = "item-actions";
  item_text.className = "text field";
  item_text.type = "text";
  item_text.placeholder = "Add a new task";
  item_date.className = "date field";
  item_date.type = "date";
  item_time.className = "time field";
  item_time.type = "time";
  item_delete.type = "button";
  item_delete.innerHTML = "X";

  item_text.id = "item_text";
  item_date.id = "item_date";
  item_time.id = "item_time";
  item_delete.id = "item_delete";

  item_info.append(item_text, item_date, item_time);
  item_actions.appendChild(item_delete);

  item.append(item_info, item_actions);
  todo_list.insertBefore(item, addBtn);

  // add event listener for delete button
  item_delete.addEventListener("click", function () {
    item.remove();
  });

  // adds event listener for when to save and stuff P.S. I had to GPT thislol
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        confirm_item(list_id);
      }
    });
  });
}

function confirm_item(id) {
  const task_text = document.getElementById("item_text");
  const task_date = document.getElementById("item_date");
  const task_time = document.getElementById("item_time");
  if (!task_text || !task_date || !task_time) {
    console.error("One or more required fields are missing.");
    return;
  }

  const text = task_text.value.trim();
  const date = task_date.value.trim();
  const time = task_time.value.trim();
  const item = add_confirmed_task(text, date, time, id);
  Object.assign(todo_items, {
    [`item_${id}`]: {
      text: text,
      date: date,
      time: time, //I wanna format it ahead but like nahhhhhhhh
      classList: item.className,
      id: id,
    },
  });
  // do autosave here TODO
}

// adds a confirmed task given 3 parameters text  date and time to HTML
function add_confirmed_task(text, date, time, id) {
  const todo_list = document.getElementById("todo_list");
  const addBtn = document.getElementById("add_item");

  const item = document.createElement("div");
  const item_info = document.createElement("div");
  const text_task = document.createElement("span");
  const date_task = document.createElement("span");
  const time_task = document.createElement("span");
  const new_item = document.getElementById("new_item");

  item.className = "item confirmed pending";

  item.id = `item_${id}`;
  item_info.className = "item-info";
  text_task.className = "text_task";
  date_task.className = "date";
  time_task.className = "time";

  const formatted_date = new Date(`${date}T${time}`);

  const formattedDate = formatted_date.toLocaleDateString();
  const formattedTime = formatted_date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  text_task.textContent = text;
  date_task.textContent = formattedDate;
  time_task.textContent = formattedTime;
  item_info.append(text_task, date_task, time_task);
  item.appendChild(item_info);

  if (new_item) new_item.remove();
  todo_list.insertBefore(item, addBtn);

  // add event listeners here TODO

  item.addEventListener("dblclick", function () {
    if (
      item.classList.contains("done") ||
      item.id === "editItem" ||
      document.getElementById("new_item") ||
      document.getElementById("editItem")
    ) {
      return;
    }

    const oldID = item.id; // refers to the id in HTML
    const untouched = item.id;
    item.id = "editItem";

    //very inelegant code but i could not give a fuck its javascript

    const text = item_info.querySelector(".text_task").innerHTML;
    const date = item_info.querySelector(".date").innerHTML;
    const time = item_info.querySelector(".time").innerHTML;

    const formatted_date = new Date(`${date} ${time}`);

    function pad(n) {
      // helper function to turn 6 to 06, for example.
      return n.toString().padStart(2, "0");
    }

    const formattedDate = `${formatted_date.getFullYear()}-${pad(
      formatted_date.getMonth() + 1
    )}-${pad(formatted_date.getDate())}`;
    const formattedTime = `${pad(formatted_date.getHours())}:${pad(
      formatted_date.getMinutes()
    )}`;

    item_info.querySelectorAll(".text_task, .date, .time").forEach((item) => {
      item.remove();
    });

    const item_actions = document.createElement("div");
    const item_text = document.createElement("input");
    const item_date = document.createElement("input");
    const item_delete = document.createElement("button");
    const item_time = document.createElement("input");

    item_actions.className = "item-actions";
    item_text.className = "text field";
    item_text.type = "text";
    item_text.placeholder = "Edit task";
    item_date.className = "date field";
    item_date.type = "date";
    item_time.className = "time field";
    item_time.type = "time";
    item_delete.type = "button";
    item_delete.innerHTML = "X";

    item_text.id = "item_text";
    item_date.id = "item_date";
    item_time.id = "item_time";
    item_delete.id = "item_delete";

    item_text.value = text;
    item_date.value = formattedDate;
    item_time.value = formattedTime;

    item_info.append(item_text, item_date, item_time);
    item_actions.appendChild(item_delete);

    item.append(item_actions);

    // Event listeners for the editing item
    // add event listener for delete button
    item_delete.addEventListener("click", function () {
      item.remove();
      delete todo_items[oldID];
      save_list();
    });

    // adds event listener for when to save and stuff P.S. I had to GPT thislol
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const text = item_text.value.trim();
          const date = item_date.value.trim();
          const time = item_time.value.trim();

          Object.assign(todo_items, {
            [oldID]: {
              text: text,
              date: date,
              time: time, //I wanna format it ahead but like nahhhhhhhh
              classList: item.className,
              id: oldID.split("_")[1], //Just the number
            },
          });

          item.removeChild(item_actions);
          item_info.removeChild(item_text);
          item_info.removeChild(item_time);
          item_info.removeChild(item_date);

          const text_task = document.createElement("span");
          const date_task = document.createElement("span");
          const time_task = document.createElement("span");

          text_task.className = "text_task";
          date_task.className = "date";
          time_task.className = "time";

          const formatted_date = new Date(`${date}T${time}`);

          const formattedDate = formatted_date.toLocaleDateString();
          const formattedTime = formatted_date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          text_task.textContent = text;
          date_task.textContent = formattedDate;
          time_task.textContent = formattedTime;
          item_info.append(text_task, date_task, time_task);
          item.id = oldID;
        }
      });
    });
  });

  item.addEventListener("click", function () {
    let classList = item.classList;
    let itemInList = todo_items[item.id];

    if (item.id === "editItem") {
      // just make sures that when item is dbclick it is styled correctly
      classList.remove("done");
      classList.add("pending");
      itemInList.classList = item.className;
      return;
    }
    if (classList.contains("pending")) {
      classList.remove("pending");
      classList.add("done");
      itemInList.classList = item.className;
      return;
    }

    if (classList.contains("done")) {
      classList.remove("done");
      classList.add("pending");
      itemInList.classList = item.className;
      return;
    }
  });
  return item;
}

// adds event listener for when to save and stuff
function titleINP_init() {
  let newTitleInp = document.getElementById("list_title_input");

  if (!newTitleInp) return;

  newTitleInp.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !document.getElementById("list_title")) {
      // checks if enter was the key and if the title already been set to prevent from double
      new_title = event.target.value.trim();
      newTitleInp.remove();
      wrapper = document.getElementById("list_title_wrapper");

      const title = document.createElement("h1");
      title.id = "list_title";
      title.className = "list-title";

      title.innerHTML = new_title || "Untitled List";
      wrapper.appendChild(title);

      current_list = new_title || "Untitled List";
      todo_items = {}; // reset todo_items for the new list
      save_list();
    }
  });
}

//  save button functionality
function save_list() {
  // saves using the todo_items object
  if (document.querySelector("#editItem")) {
    //prevents from saving while editing an item
    alert("Can not save list while editing item");
    return;
  }

  let lists = localStorage.getItem("todo_lists");
  if (!current_list) {
    alert("Please enter a list title before saving.");
    return;
  }
  if (!lists) {
    // creates the todo_lists in local storage if does not exist
    localStorage.setItem("todo_lists", JSON.stringify({}));
  }
  lists = JSON.parse(localStorage.getItem("todo_lists"));
  lists[current_list] = todo_items;
  localStorage.setItem("todo_lists", JSON.stringify(lists));

  localStorage.setItem("lastListOpened", current_list);
}

// new list button functionality
function new_list() {
  const wrapper = document.getElementById("list_title_wrapper");
  const newTitleInp = document.createElement("input");

  current_list = null;
  newTitleInp.id = "list_title_input";
  newTitleInp.className = "list-title-input";
  newTitleInp.type = "text";
  newTitleInp.placeholder = "Enter new list title";
  newTitleInp.maxLength = 30;

  wrapper.innerHTML = ""; // clear existing title
  wrapper.appendChild(newTitleInp);
  titleINP_init(); // reinitialize the input event listener

  document.querySelectorAll(".confirmed").forEach((item) => {
    item.remove();
  });
}

function load_list(list_name) {
  const todo_list = JSON.parse(localStorage.getItem("todo_lists"))[list_name];
  const list_title = document.getElementById("list_title");
  todo_items = {};

  current_list = list_name || "Untitled List";
  if (!todo_list) {
    console.error("List not found in localStorage.");
    new_list();
    current_list = null;
    return;
  }

  list_title.innerHTML = list_name;

  document.querySelectorAll(".confirmed").forEach((item) => {
    item.remove();
  });

  itemIds = Object.keys(todo_list);

  for (let i = 0; i < itemIds.length; i++) {
    const item = todo_list[itemIds[i]];
    const DOMItem = add_confirmed_task(
      item.text,
      item.date,
      item.time,
      item.id
    );
    todo_items[`item_${item.id}`] = {
      text: item.text,
      date: item.date,
      time: item.time,
      classList: item.classList, // item refers to the item in todo_items
      id: item.id,
    };

    DOMItem.className = item.classList;
  }
  if (list_name) localStorage.setItem("lastListOpened", current_list);
}

// functionalit for the left and right arrows to move between lists
function moveToNewList(step) {
  const lists = JSON.parse(localStorage.getItem("todo_lists")) || {};
  const listNames = Object.keys(lists);
  const currentIndex = listNames.indexOf(current_list);

  save_list(); //save before moving

  if (currentIndex === -1) {
    console.error("Current list not found in localStorage.");
    return false;
  }

  const newIndex = currentIndex + step;
  // Check if the new index is within bounds
  if (newIndex < 0 || newIndex >= listNames.length) {
    console.warn("No more lists in that direction.");
    return false;
  }
  load_list(listNames[newIndex]);
  return true;
}

function delList() {
  save_list();

  const lists = JSON.parse(localStorage.getItem("todo_lists"));
  let list = lists[current_list];

  let old_current_list = current_list;

  if (!moveToNewList(-1)) {
    if (!moveToNewList(1)) {
      new_list();
    }
  }

  delete lists[old_current_list];

  localStorage.setItem("todo_lists", JSON.stringify(lists));
}

//  INITIALIZATION STUFF
if (localStorage.getItem("lastListOpened")) {
  load_list(localStorage.getItem("lastListOpened"));
} else {
  new_list(); // create a new list if no last opened list
}

if (!localStorage.getItem("itemIDLogger")) {
  localStorage.setItem("itemIDLogger", itemIDLogger);
}

titleINP_init();
