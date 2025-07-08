document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const newTaskInput = document.getElementById("newTask");
    const taskList = document.getElementById("taskList");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    const filters = {
        all: document.getElementById("allBtn"),
        completed: document.getElementById("completedBtn"),
        pending: document.getElementById("pendingBtn"),
    };

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    };

    const renderTasks = () => {
        taskList.innerHTML = "";
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "all") return true;
            if (currentFilter === "completed") return task.completed;
            if (currentFilter === "pending") return !task.completed;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.toggle("completed", task.completed);
            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                    <button class="toggleCompleteBtn">${task.completed ? "Undo" : "Complete"}</button>
                </div>
            `;
            li.querySelector(".editBtn").addEventListener("click", () => editTask(task, li));
            li.querySelector(".deleteBtn").addEventListener("click", () => deleteTask(task, li));
            li.querySelector(".toggleCompleteBtn").addEventListener("click", () => toggleComplete(task, li));
            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const newTask = { text: taskText, completed: false };
            tasks.push(newTask);
            newTaskInput.value = "";
            saveTasks();
        }
    };

    const editTask = (task, li) => {
        const newText = prompt("Edit task:", task.text);
        if (newText !== null) {
            task.text = newText;
            saveTasks();
        }
    };

    const deleteTask = (task, li) => {
        tasks = tasks.filter(t => t !== task);
        saveTasks();
    };

    const toggleComplete = (task, li) => {
        task.completed = !task.completed;
        saveTasks();
    };

    const clearAllTasks = () => {
        tasks = [];
        saveTasks();
    };

    const toggleTheme = () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.dataset.theme = newTheme;
        toggleThemeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
        localStorage.setItem("theme", newTheme);
    };

    // Event listeners
    addTaskBtn.addEventListener("click", addTask);
    newTaskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });
    clearAllBtn.addEventListener("click", clearAllTasks);
    toggleThemeBtn.addEventListener("click", toggleTheme);

    filters.all.addEventListener("click", () => {
        currentFilter = "all";
        renderTasks();
    });
    filters.completed.addEventListener("click", () => {
        currentFilter = "completed";
        renderTasks();
    });
    filters.pending.addEventListener("click", () => {
        currentFilter = "pending";
        renderTasks();
    });

    // Initialize theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.dataset.theme = savedTheme;
    toggleThemeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

    // Initial render
    renderTasks();
});
