import { tasks, findTaskById } from './tasks.js';
import { renderTasks } from './dom.js';
import { createTask, updateTask, deleteTask } from './api.js';

const form = document.querySelector<HTMLFormElement>('form');
const input = document.querySelector<HTMLInputElement>('input');

if (form === null || input === null) {
    throw new Error('Form or input not found');
}

const VALID_FILTERS = ['all', 'active', 'completed'] as const;

type Filter = typeof VALID_FILTERS[number]

let currentFilter: Filter = 'all';

// New task addition
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === '') {
        return;
    }

    createTask(taskText).then(function (newTask) {
        tasks.push(newTask);

        renderTasks(currentFilter);

        input.value = '';
    });
});

const filters = document.querySelector<HTMLDivElement>('.filters');

if (filters === null) {
    throw new Error('Filters not found');
}

// Task filter
filters.addEventListener('click', function (event) {
    if (!(event.target instanceof HTMLButtonElement)) {
        return;
    }

    const filter = event.target.dataset.filter;

    if (filter !== 'all' && filter !== 'active' && filter !== 'completed') {
        return;
    }

    currentFilter = filter;

    renderTasks(currentFilter);
});

const taskList = document.querySelector<HTMLUListElement>('ul');

if (taskList === null) {
    throw new Error('Task list not found');
}

let clickTimer: ReturnType<typeof setTimeout> | null = null;

taskList.addEventListener('click', function (event) {
    const clickedElement = event.target;

    // Task deletion
    if (clickedElement instanceof HTMLButtonElement) {
        const taskElement = clickedElement.parentElement;

        if (!(taskElement instanceof HTMLLIElement)) {
            return;
        }

        const taskId = Number(taskElement.dataset.id);

        const taskIndex = tasks.findIndex(function (task) {
            return task.id === taskId;
        });

        if (taskIndex !== -1) {
            deleteTask(taskId).then(function () {
                tasks.splice(taskIndex, 1);

                renderTasks(currentFilter);
            });
        }

        return;
    }

    if (!(clickedElement instanceof HTMLSpanElement)) {
        return;
    }

    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }

    // Task completion
    clickTimer = setTimeout(function () {
        const taskElement = clickedElement.parentElement;

        if (!(taskElement instanceof HTMLLIElement)) {
            return;
        }

        const taskId = Number(taskElement.dataset.id);

        const taskData = findTaskById(taskId);

        if (!taskData) {
            return;
        }

        const completed = !taskData.completed;

        updateTask(taskData.id, { completed }).then(function (updatedTask) {
            taskData.completed = updatedTask.completed;

            renderTasks(currentFilter);
        });

        clickTimer = null;
    }, 200);
});

// Task renaming
taskList.addEventListener('dblclick', function (event) {
    const clickedElement = event.target;

    if (!(clickedElement instanceof HTMLSpanElement)) {
        return;
    }

    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }

    const taskElement = clickedElement.parentElement;

    if (!(taskElement instanceof HTMLLIElement)) {
        return;
    }

    const taskId = Number(taskElement.dataset.id);

    const taskData = findTaskById(taskId);

    if (!taskData) {
        return;
    }

    const newText = prompt('Изменить задачу:', taskData.text);

    if (newText === null) {
        return;
    }

    const trimmedText = newText.trim();

    if (trimmedText === '') {
        return;
    }

    updateTask(taskId, {text: trimmedText}).then(function (updatedTask) {
        taskData.text = updatedTask.text;

        renderTasks(currentFilter);
    })

});