const existingTasks = [
    { title: 'FSD Assignment', deadline: '2024-10-02', description: 'Creating a website consisting of 5 pages', priority: 'High' },
    { title: 'Study for Exams', deadline: '2024-10-05', description: 'Prepare for upcoming exams', priority: 'Medium' },
    { title: 'Grocery Shopping', deadline: '2024-10-10', description: 'Buy groceries for the week', priority: 'Low' },
    { title: 'Complete Project', deadline: '2024-10-08', description: 'Finish the group project', priority: 'Medium' }
];

let pieChart;

function displayTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = ''; // Clear existing tasks
    existingTasks.forEach(task => {
        const taskHTML = createTaskHTML(task);
        tasksList.innerHTML += taskHTML;
    });
}

function createTaskHTML(task) {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    let urgencyClass = '';

    // Determine urgency and class based on the deadline
    if (deadlineDate < now) {
        urgencyClass = 'red'; // Past due
    } else {
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff <= 3) urgencyClass = 'yellow'; // Urgent
        else if (daysDiff <= 7) urgencyClass = 'orange'; // Warning
        else urgencyClass = 'green'; // Normal
    }

    return `
        <div class="task ${urgencyClass}">
            <div class="task-content">
                <div class="task-name">
                    <h4>${task.title}</h4>
                </div>
                <div class="delete-btn" onclick="deleteTask('${task.title}')">
                    <img src="https://img.icons8.com/ios-filled/50/800000/trash.png" alt="Delete" style="width: 20px; height: 20px;"/>
                </div>
            </div>
            <div class="task-deadline">
                <h4>Due Date: ${task.deadline}</h4>
            </div>
            <div class="task-description">
                <p>Description: <strong>${task.description}</strong></p>
            </div>
            <div class="task-priority">
                <h4>Priority: ${task.priority}</h4>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <input type="range" min="0" max="100" value="0" class="progress-slider" onchange="updateProgress(this, '${task.title}')">
                    <div class="progress" style="width: 0%;"></div>
                </div>
                <div class="progress-percentage">0%</div>
            </div>
        </div>
    `;
}

function deleteTask(taskTitle) {
    const taskIndex = existingTasks.findIndex(task => task.title === taskTitle);
    if (taskIndex > -1) {
        // Remove the task from the array
        existingTasks.splice(taskIndex, 1);
        displayTasks(); // Refresh the task list
        updatePieChart(); // Update pie chart
    }
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const deadline = document.getElementById('deadline').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('priority').value;

    // Create a new task object
    const newTask = {
        title: title,
        deadline: deadline,
        description: description,
        priority: priority
    };

    existingTasks.push(newTask); // Add the new task to the array
    displayTasks(); // Refresh the task list

    // Clear input fields
    document.getElementById('taskTitle').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('priority').value = '';

    updatePieChart(); // Update the pie chart with the new task
}

function updateProgress(slider, taskTitle) {
    const taskDiv = slider.closest('.task');
    const progressBar = taskDiv.querySelector('.progress');
    const percentageText = taskDiv.querySelector('.progress-percentage');

    const percentage = slider.value; // Get the value from the slider
    progressBar.style.width = `${percentage}%`; // Update the width of the progress bar
    percentageText.textContent = `${percentage}%`; // Update the displayed percentage
}

function searchTasks() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tasksList = document.getElementById('tasksList');
    const tasks = tasksList.getElementsByClassName('task');

    // Loop through all tasks and hide those that do not match the search
    for (let i = 0; i < tasks.length; i++) {
        const taskName = tasks[i].getElementsByClassName('task-name')[0].textContent.toLowerCase();
        tasks[i].style.display = taskName.includes(input) ? '' : 'none';
    }
}
function createPieChart() {
    const ctx = document.getElementById('taskChart').getContext('2d'); // Correct id is 'taskChart'
    
    // Count the number of tasks in each urgency category
    const taskCounts = countTaskCategories();

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Overdue', 'Urgent', 'Warning', 'Normal'],
            datasets: [{
                label: 'Task Distribution',
                data: taskCounts,
                backgroundColor: ['#ff0000', 'yellow', 'orange', 'green'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const taskType = tooltipItem.label;
                            const count = tooltipItem.raw;
                            return `${taskType}: ${count} tasks`;
                        }
                    }
                }
            }
        }
    });
}

function updatePieChart() {
    // Count the number of tasks in each category
    const taskCounts = countTaskCategories();

    // Update the pie chart with the new data
    pieChart.data.datasets[0].data = taskCounts;
    pieChart.update();
}

function countTaskCategories() {
    const now = new Date();
    let overdueCount = 0;
    let urgentCount = 0;
    let warningCount = 0;
    let normalCount = 0;

    existingTasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (deadlineDate < now) {
            overdueCount++;
        } else if (daysDiff <= 3) {
            urgentCount++;
        } else if (daysDiff <= 7) {
            warningCount++;
        } else {
            normalCount++;
        }
    });

    return [overdueCount, urgentCount, warningCount, normalCount];
}

// Initial display of tasks and pie chart on page load
window.onload = function() {
    displayTasks();
    createPieChart();
};
