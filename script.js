
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function updateTaskCount() {
    const remaining = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} remaining`;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(currentTask => currentTask.id !== task.id);
            renderTasks();
        });

        item.append(checkbox, taskText, deleteButton);
        taskList.appendChild(item);
    });

    updateTaskCount();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
    taskInput.focus();
});

renderTasks();
