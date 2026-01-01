const btnAdd = document.querySelector(".btn-add");
const showtask = document.getElementById("showtask");
const form = document.getElementById("form");
const taskTitleEl = document.getElementById("taskTitle");
const dateEl = document.getElementById("date");
const searchTask = document.getElementById("searchInput");

const textNotes = document.getElementById("Notes");

let data = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formElement = e.target;
  const newObject = {
    title: formElement.elements.title.value,
    date: formElement.elements.date.value,
    perority: formElement.elements.periority.value,
    notes: formElement.elements.note.value,
    Completed: false,
  };
  function allFieldsHaveValue(obj) {
    return Object.values(obj).every(
      (value) => value !== null && value !== undefined && value !== ""
    );
  }

  if (allFieldsHaveValue(newObject)) {
    data.push(newObject);
  }
  showDataInbox();
  clearForm();
});

function clearForm() {
  taskTitleEl.value = "";
  dateEl.value = "";
  textNotes.value = "";
}
///////////////////////////////////////////render data in dom 
function showDataInbox() {
  showtask.innerHTML = "";
  const el = data.map((task, index) => {
    const taskRow = document.createElement("div");

    taskRow.className = `task-row  ${task.perority}`;
    taskRow.setAttribute("data-index", index);
    if (task.Completed) {
      taskRow.classList.add("completed");
    }
    taskRow.innerHTML = `<p>${task.title}  -   ${task.date}</p> 
        <div >
               <button  class="btn-complete">${
                 task.Completed ? "Complete" : "UnComplete"
               }</button>
              <button  style="margin-left: 1rem" class="btn-del" index= ${index}  class="btn-complete">Delete</button>
        </div>
    `;

    taskRow.querySelector(".btn-complete").addEventListener("click", () => {
      data[index].Completed = !data[index].Completed;
      showDataInbox();
      console.log(data[index].Completed);
    });

    //delete element from data list
    taskRow.querySelector(".btn-del").addEventListener("click", () => {
      data.splice(index, 1);

      showDataInbox();
    });

    showtask.appendChild(taskRow);
  });
  return el;
}
//////////////////////////////////////////////////////////////////////start  apply filter
searchTask.addEventListener("input", applyFilter);
//apply filter 
function applyFilter() {
  const searchTerm = searchTask.value.toLowerCase();
  const filteredTask = data.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);

    return matchesSearch;
  });

  showtask.innerHTML = "";
  const el = filteredTask.map((task, index) => {
    const taskRow = document.createElement("div");

    taskRow.className = `task-row  ${task.perority}`;
    taskRow.setAttribute("data-index", index);
    if (task.Completed) {
      taskRow.classList.add("completed");
    }
    taskRow.innerHTML = `<p>${task.title}  -   ${task.date}</p> 
        <div >
               <button  class="btn-complete">${
                 task.Completed ? "Complete" : "UnComplete"
               }</button>
              <button  style="margin-left: 1rem" class="btn-del" index= ${index}  class="btn-complete">Delete</button>
        </div>
    `;

    taskRow.querySelector(".btn-complete").addEventListener("click", () => {
      data[index].Completed = !data[index].Completed;
      showDataInbox();
      console.log(data[index].Completed);
    });

    //delete element from data list
    taskRow.querySelector(".btn-del").addEventListener("click", () => {
      data.splice(index, 1);
      applyFilter();
    });

    showtask.appendChild(taskRow);
  });
  return el;

   
}
