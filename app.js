const btnAdd = document.querySelector(".btn-add");
const showtask = document.getElementById("showtask");
const form = document.getElementById("form");
const taskTitleEl = document.getElementById("taskEl");

const dateEl = document.getElementById("data");
const btnComplte = document.getElementById("btnComplte");
const btnDel = document.getElementById("btnDel");
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
  showDataInbox(data);
});

function showDataInbox(data) {
  showtask.innerHTML = "";
  const el = data.map((task, index) => {
    const taskRow = document.createElement("div");
    taskRow.className = `task-row  ${task.perority}`;
    taskRow.setAttribute("data-index", index);
    taskRow.innerHTML = `<p>${task.title}  -   ${task.date}</p> 
    <div >
        <button  class="btn-complete">${
          task.Completed ? "Complete" : "UnComplete"
        }</button>
         <button  style="margin-left: 1rem" class="btn-del"  class="btn-complete">Delete</button>
    </div>
    
    `;

 
    showtask.appendChild(taskRow);
    console.log(task, index);
    console.log(data);
  });
  return el;
}
