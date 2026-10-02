import { tasks } from './tasks.js';
import type { Task } from './tasks.js';

export function createTask(taskData: Task): HTMLLIElement {
    const task = document.createElement('li');
    const taskTextElement = document.createElement('span');
    const deleteButton = document.createElement('button');

    task.dataset.id = String(taskData.id);

    taskTextElement.textContent = taskData.text;
    deleteButton.textContent = 'Удалить';

    if (taskData.completed) {
        taskTextElement.classList.add('completed');
    }

    task.append(taskTextElement, deleteButton);

    return task;
}

export function renderTasks(currentFilter: string): void {
    const taskList = document.querySelector<HTMLUListElement>('ul');

    if (taskList === null) {
        throw new Error('<ul> not found');
    }
    
    taskList.innerHTML = '';

    let tasksToRender = tasks;

    if (currentFilter === 'active') {
        tasksToRender = tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentFilter === 'completed') {
        tasksToRender = tasks.filter(function (task) {
            return task.completed;
        });
    }

    tasksToRender.forEach(function (taskData) {
        const task = createTask(taskData);
        taskList.append(task);
    });
}