const taskInput = document.querySelector(".doinput input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".btn-control"),
taskbar = document.querySelector(".task-bar");

let editId;
let isEditedTask = false;
// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("doinput"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            //if todo status is completed, sert the isCompleted value to check
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all"){
                li += `<li class="list">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="bi bi-three-dots"></i>
                            <ul class="task-menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><i class="bi bi-pen"></i>Edit</li>
                                <li onclick="deleteTask(${id})"><i class="bi bi-trash"></i>Delete</li>
                            </ul>
                        </div>
                       </li>`;
            }
        });
    }
    //if li isn'tempty, insert the value inside the text box else insert span
    taskbar.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all");

function showMenu(selectedTask){
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e =>{
        //removing show class form the task menu on the document click
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName){
    editId = taskId;
    isEditedTask = true;
    taskInput.focus();
    taskInput.value = taskName;
}

function deleteTask(deleteId){
    //remove selected task from array/todos
    isEditedTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", ()=>{
    //remove all todos from array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
})

function updateStatus(selectedTask){
    //getting paragram that contain task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){ // if isEditedTask ins't true
           if(!todos){ // if todos isn't exist, pass an empty array to todos
            todos = [];
           }
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo); // adding new task to todos
        }else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});