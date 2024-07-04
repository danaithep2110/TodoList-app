document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const deleteBtn = document.getElementById('deleteBtn');
    const yesBtn = document.getElementById('yesBtn');

    // Load tasks from the server
    function loadTasks() {
        fetch('http://localhost:3000/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.classList.add('task-item');
                    if (task.completed) {
                        li.classList.add('completed');
                    }
                    li.dataset.id = task.id;
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = task.description;
                    li.appendChild(a);
                    taskList.appendChild(li);

                    li.addEventListener('click', function() {
                        document.querySelectorAll('.task-item').forEach(item => item.classList.remove('selected'));
                        li.classList.add('selected');
                    });
                });
            })
            .catch(error => console.error('Error loading tasks:', error));
    }

    addBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            fetch('http://localhost:3000/api/createtask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: taskText })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(task => {
                loadTasks();
                taskInput.value = '';
            })
            .catch(error => console.error('Error adding task:', error));
        }
    });

    deleteBtn.addEventListener('click', function() {
        const selectedTask = document.querySelector('.task-item.selected');
        if (selectedTask) {
            const taskId = selectedTask.dataset.id;
            fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(() => {
                loadTasks();
            })
            .catch(error => console.error('Error deleting task:', error));
        }
    });

    yesBtn.addEventListener('click', function() {
        const selectedTask = document.querySelector('.task-item.selected');
        if (selectedTask) {
            const taskId = selectedTask.dataset.id;
            fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: true })
            })
            .then(() => {
                loadTasks();
            })
            .catch(error => console.error('Error marking task as completed:', error));
        }
    });

    loadTasks();
});
