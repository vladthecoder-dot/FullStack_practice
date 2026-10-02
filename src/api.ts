import type { Task } from './tasks.js';

export async function getTasks(): Promise<Task[]> {
    const response = await fetch('http://localhost:3000/tasks');

    if (!response.ok) {
        throw new Error('Не удалось загрузить задачи');
    }

    const tasks = await response.json();

    return tasks;
}

export async function createTask(text: string): Promise<Task> {
    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    });

    if (!response.ok) {
        throw new Error('Не удалось создать задачу');
    }

    const task = await response.json();

    return task;
}

export async function updateTask(taskId: number, data: {text?: string, completed?: boolean}): Promise<Task> {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить задачу');
    }

    const task = await response.json();

    return task;
}

export async function deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить задачу');
    }
}