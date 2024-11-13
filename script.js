document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    const showAllBtn = document.getElementById('showAll');
    const showCompletedBtn = document.getElementById('showCompleted');
    const showPendingBtn = document.getElementById('showPending');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let showAll = false;
    let showCompleted = false;
    let showPending = false;

    const renderTasks = () => {
        taskList.innerHTML = '';

        // Determine which tasks to show based on the flags
        let filteredTasks = tasks;

        if (showCompleted) {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (showPending) {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (!showAll) {
            return; // Exit if not showing any tasks
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            li.appendChild(taskText);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.gap = '10px';

            if (!task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.textContent = 'Complete';
                completeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    task.completed = true;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                });
                buttonContainer.appendChild(completeBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            });
            buttonContainer.appendChild(deleteBtn);

            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    };

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            if (showAll) {
                renderTasks();
            }
        } else {
            alert("Please enter a task.");
        }
    });

    showAllBtn.addEventListener('click', () => {
        showAll = !showAll;
        showAllBtn.textContent = showAll ? 'Hide All' : 'Show All';
        if (showAll) {
            showCompleted = false;
            showPending = false;
            showCompletedBtn.textContent = 'Show Completed';
            showPendingBtn.textContent = 'Show Pending';
        }
        renderTasks();
    });

    showCompletedBtn.addEventListener('click', () => {
        showCompleted = !showCompleted;
        showCompletedBtn.textContent = showCompleted ? 'Hide Completed' : 'Show Completed';
        if (showCompleted) {
            showAll = false;
            showPending = false;
            showAllBtn.textContent = 'Show All';
            showPendingBtn.textContent = 'Show Pending';
        }
        renderTasks();
    });

    showPendingBtn.addEventListener('click', () => {
        showPending = !showPending;
        showPendingBtn.textContent = showPending ? 'Hide Pending' : 'Show Pending';
        if (showPending) {
            showAll = false;
            showCompleted = false;
            showAllBtn.textContent = 'Show All';
            showCompletedBtn.textContent = 'Show Completed';
        }
        renderTasks();
    });

    renderTasks(); // Initial render of tasks
});
