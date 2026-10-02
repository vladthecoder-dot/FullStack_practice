export type Task = {
    id: number;
    text: string;
    completed: boolean;
};

export const tasks: Task[] = [];

export function findTaskById(taskId: number): Task | undefined {
    return tasks.find(function (task) {
        return task.id === taskId;
    });
}