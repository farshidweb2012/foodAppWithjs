
const showtask = document.getElementById("showtask");
const form = document.getElementById("form");
const taskTitleEl = document.getElementById("taskTitle");
const dateEl = document.getElementById("date");
const searchTask = document.getElementById("searchInput");
const textNotes = document.getElementById("Notes");
const periorityValue = document.getElementById("periorityEl");
const SortByDateEl = document.getElementById("sortByDate");
const toggleBtn = document.getElementById("toggleTheme");
const expprtAspdf = document.getElementById("ExportBtn");
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
periorityValue.addEventListener("change", applyFilter);
SortByDateEl.addEventListener("change", applyFilter);
//apply filter
function applyFilter() {
  const searchTerm = searchTask.value.toLowerCase();
  const perValue = periorityValue.value;
  const selectedDateByUser = SortByDateEl.value;
  console.log(selectedDateByUser);

  const filteredTask = data.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesPeriority = task.perority === perValue || perValue === "";

    return matchesSearch && matchesPeriority;
  });

  if (selectedDateByUser === "asc") {
    filteredTask.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (selectedDateByUser === "dec") {
    filteredTask.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

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

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

expprtAspdf.addEventListener("click", () => {
  console.log(window);
  const {jsPDF}=window.jsPDF()
  const Mydocuemnts = new jsPDF();
  let yOffset = 10;
  data.map((task) => {
    const textContent = `${task.title} date ${task.date} -priority  ${task.perority}`;
    Mydocuemnts.text(textContent, 10, yOffset);
    yOffset += 10;
  });
  Mydocuemnts.save("task.pdf");
});
