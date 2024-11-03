class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.searchTerm = '';
        this.editingTaskId = null; // ID zadania, które jest edytowane
        this.loadEventListeners();
        this.render();
    }

    loadEventListeners() {
        document.getElementById('taskForm').addEventListener('submit', (event) => this.addTask(event));
        document.getElementById('searchInput').addEventListener('input', (event) => {
            this.searchTerm = event.target.value.toLowerCase();
            this.render();
        });
        document.addEventListener('click', (event) => this.finishEditing(event));
    }

    addTask(event) {
        event.preventDefault();

        const taskText = document.getElementById('taskInput').value.trim();
        const dueDate = document.getElementById('taskDate').value || null;

        // Walidacja zadania: tekst musi mieć 3-255 znaków
        if (taskText.length < 3 || taskText.length > 255) {
            alert("Task text must be between 3 and 255 characters.");
            return;
        }

        // Walidacja daty: musi być pusta lub w przyszłości
        const currentDate = new Date().toISOString().split('T')[0];
        if (dueDate && dueDate <= currentDate) {
            alert("Date must be in the future or empty.");
            return;
        }

        // Dodanie zadania do listy
        this.tasks.unshift({ id: Date.now(), text: taskText, date: dueDate });
        this.saveTasks();
        this.render();

        document.getElementById('taskInput').value = '';
        document.getElementById('taskDate').value = '';
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    editTask(id) {
        this.editingTaskId = id;
        this.render();
    }

    finishEditing(event) {
        // Zapisz zmiany, jeśli kliknięto poza zadanie będące w edycji
        if (this.editingTaskId !== null && !event.target.classList.contains('task-text')) {
            const input = document.querySelector(`#task-${this.editingTaskId} input`);
            if (input) {
                const updatedText = input.value.trim();
                if (updatedText.length >= 3 && updatedText.length <= 255) {
                    const task = this.tasks.find(task => task.id === this.editingTaskId);
                    task.text = updatedText;
                    this.saveTasks();
                }
                this.editingTaskId = null;
                this.render();
            }
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    get filteredTasks() {
        if (this.searchTerm.length < 2) return this.tasks;
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.searchTerm));
    }

    highlightTerm(text) {
        if (!this.searchTerm) return text;
        const regex = new RegExp(`(${this.searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    render() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.id = `task-${task.id}`;
            taskItem.classList.add('task-item');

            // Jeśli zadanie jest edytowane, wyświetl pole tekstowe
            if (this.editingTaskId === task.id) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = task.text;
                input.classList.add('task-text');
                taskItem.appendChild(input);
                input.focus();
            } else {
                const taskText = document.createElement('span');
                taskText.classList.add('task-text');
                taskText.innerHTML = this.highlightTerm(task.text); // Użycie metody do podświetlania
                taskText.addEventListener('click', () => this.editTask(task.id));
                taskItem.appendChild(taskText);
            }

            if (task.date) {
                const taskDate = document.createElement('span');
                taskDate.classList.add('task-date');
                taskDate.textContent = new Date(task.date).toLocaleDateString();
                taskItem.appendChild(taskDate);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Done!';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
        });
    }
}

// Inicjalizacja TaskManager po załadowaniu strony
window.addEventListener('load', () => new TaskManager());
