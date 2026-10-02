import { Pool } from 'pg';
import 'dotenv/config'

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

const requiredEnv = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

const port = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Invalid DB_PORT');
}

const config = {
    host: process.env.DB_HOST,
    port: port,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

export const pool = new Pool(config);

export async function createTask(text: string): Promise<Task> {
    const result = await pool.query(
        'INSERT INTO tasks (text) VALUES ($1) RETURNING id, text, completed',
        [text]
    );

    return result.rows[0];
}

export async function getTasks(): Promise<Task[]> {
    const result = await pool.query(
        'SELECT id, text, completed FROM tasks ORDER BY id'
    );

    return result.rows;
}

export async function updateTask(taskId: number, data: {text?: string, completed?: boolean}): Promise<Task|undefined> {
    const result = await pool.query(`
        UPDATE tasks
        SET
            text = COALESCE($2, text),
            completed = COALESCE($3, completed)
        WHERE id = $1
        RETURNING id, text, completed`,
        [
            taskId,
            data.text ?? null,
            data.completed ?? null
        ]
    );

    return result.rows[0];
}

export async function deleteTask(taskId: number): Promise<boolean> {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1',
        [taskId]
    );

    return result.rowCount === 1
}