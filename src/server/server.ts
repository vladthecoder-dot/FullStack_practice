import { createServer } from 'node:http';
import { createTask, getTasks, updateTask, deleteTask } from './db.js'

const server = createServer(function (request, response) {
    function setHeader(code: number) {
        response.statusCode = code;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    function badRequest(errorText: string) {
        setHeader(400);
        response.end(JSON.stringify({
            error: errorText
        }))
    }

    response.setHeader(
        'Access-Control-Allow-Origin',
        'http://127.0.0.1:5500'
    );

    response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );

    response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
    }

    if (request.method === 'GET') {
        getMethod()
        return;
    }

    if (request.method === 'POST') {
        postMethod()
        return
    }

    if (request.method === 'PATCH') { 
        patchMethod();
        return;
    }

    if (request.method === 'DELETE'){
        deleteMethod();
        return;
    }

    function patchMethod() {
        if (!request.url?.startsWith('/tasks/')) {
            return;
        }

        const taskId = Number(request.url.split('/')[2]);
        
        // Id validation
        if (Number.isNaN(taskId)) {
            badRequest('Invalid task ID')
            return;
        }
        

        let body = '';

        request.on('data', function (chunk) {
            body += chunk;
        });

        
        request.on('end', async function () {
            const data = JSON.parse(body);

            const hasText = Object.prototype.hasOwnProperty.call(data, 'text')
            const hasCompleted = Object.prototype.hasOwnProperty.call(data, 'completed')

            if (!hasText && !hasCompleted) {
                badRequest('Invalid task data')                
                return;
            }

            if (hasText && (typeof data.text !== 'string' || data.text.trim() === '')) {
                badRequest('Invalid text value')
                return
            }

            if (hasCompleted && (typeof data.completed !== 'boolean')) {
                badRequest('Invalid completed value')
                return
            }

            const updateData: {
                text?: string;
                completed?: boolean;
            } = {};

            if (hasText) {
                updateData.text = data.text.trim();
            }

            if (hasCompleted) {
                updateData.completed = data.completed;
            }

            updateTask(taskId, updateData).then(function (task) {
                if (!task) {
                    setHeader(404)
                    response.end(JSON.stringify({
                        error: 'Task not found'
                    }))

                    return
                }

                setHeader(200)
                response.end(JSON.stringify(task))
            })
        });
    }

    function deleteMethod() {
        if (!request.url?.startsWith('/tasks/')) {
            return;
        }

        const taskId = Number(request.url.split('/')[2])

        // Id validation
        if (Number.isNaN(taskId)) {
            setHeader(404)
            response.end(JSON.stringify({
                error: 'Task not found'
            }));

            return;
        }

        deleteTask(taskId).then(function (isDeleted) {
            if (isDeleted === false) {
                badRequest('Task not found')
                return
            }

            response.statusCode = 204
            response.end();
        })
    }

    function getMethod() {
        if (request.url !== '/tasks') {
            return;
        }

        getTasks().then(function (tasks) {
            setHeader(200);
            response.end(JSON.stringify(tasks));
        })
    }

    function postMethod() {
        if (request.url !== '/tasks') {
            return;
        }

        let body = '';

        request.on('data', function (chunk) {
            body += chunk;
        });

        request.on('end', function () {
            const data = JSON.parse(body);

            if (typeof data.text !== 'string' || data.text.trim() === '') {
                badRequest('Invalid task data')
                return;
            }

            createTask(data.text.trim()).then(function (newTask) {
                setHeader(201)
                response.end(JSON.stringify(newTask));
            })
        });
    }

    response.statusCode = 404;
    response.end('Страница не найдена');
});

server.listen(3000, function () {
    console.log('Server started: http://localhost:3000');
});