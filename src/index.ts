const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const taskDeadline = document.getElementById("taskDeadline") as HTMLInputElement;
const addTaskButton = document.getElementById("addTaskButton") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

interface Task {
    id: number;
    text: string;
    deadline: string;
    completed: boolean;
}

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
renderTasks();

function getTaskStatus(task: Task): HTMLElement {
    const icon = document.createElement("i"); 

    if (task.completed) {
        icon.classList.add("fas", "fa-check-circle", "status-done"); // ✅ Icône tâche complétée
    } else if (new Date(task.deadline) < new Date()) {
        icon.classList.add("fas", "fa-times-circle", "status-late"); // ❌ Icône deadline dépassée
    } else {
        icon.classList.add("fas", "fa-sync-alt", "status-in-progress"); // 🔄 Icône "En cours"
    }

    return icon;
}

// formatage date en JJ/MM/AAAA
function formatDate(dateString: string): string {
    if (!dateString) return "Date invalide";

    try {
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        
        // Vérification des valeurs
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return "Date invalide";
        }

        // Formatage avec padding des zéros
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        
        return `${formattedDay}/${formattedMonth}/${year}`;
    } catch {
        return "Date invalide";
    }
}

function renderTasks(): void {
    const taskList = document.getElementById("taskList") as HTMLTableElement;
    taskList.innerHTML = "";

    const today = new Date();
    const formattedToday = formatDate(today.toISOString().split("T")[0]); // Format en JJ/MM/AAAA

    const viewDate = document.getElementById("viewDate");
    if (viewDate) {
        viewDate.textContent =  `Date : ${formattedToday}`;
    }

    tasks.forEach(task => {
        const row = document.createElement("tr");

        const taskText = document.createElement("td");
        taskText.textContent = task.text;

        const statusCell = document.createElement("td");
        statusCell.appendChild(getTaskStatus(task));

        const deadlineText = document.createElement("td");
      
        if (task.deadline && task.deadline.includes('-')) {
            deadlineText.textContent = formatDate(task.deadline);
        } else {
            deadlineText.textContent = task.deadline;
        }

        const actionsCell = document.createElement("td");
        const completeButton = document.createElement("button");
        completeButton.textContent = "✔";
        completeButton.classList.add("complete-btn");
        completeButton.addEventListener("click", () => toggleTaskCompletion(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        actionsCell.appendChild(completeButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(taskText);
        row.appendChild(statusCell);
        row.appendChild(deadlineText);
        row.appendChild(actionsCell);

        taskList.appendChild(row);
    });
}

function addTask(): void {
    const taskText = taskInput.value.trim();
    const deadline = taskDeadline.value;

    if (taskText === "" || deadline === "") {
        alert("Veuillez entrer une tâche et une deadline !");
        return;
    }

    const selectedDate = new Date(deadline); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (selectedDate < today) {
        alert("Veuillez choisir une date future !");
        return;
    }
    const newTask: Task = {
        id: Date.now(),
        text: taskText,
        deadline: deadline, 
        completed: false
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskInput.value = "";
    taskDeadline.value = "";
}


addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addTask();
});

function deleteTask(taskId: number): void {
    const task = tasks.find(task => task.id === taskId);
    
    if (task && task.completed) {
        alert("Vous ne pouvez pas supprimer une tâche déjà validée !");
        return;
    }

    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}


function toggleTaskCompletion(taskId: number): void {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed; // Bascule entre "fait" et "en cours"
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

  