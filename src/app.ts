import { renderTasks } from './dom.js';
import './events.js';
import { getTasks } from './api.js';
import { tasks } from './tasks.js';

getTasks().then(function (serverTasks) {
    tasks.splice(0, tasks.length, ...serverTasks);

    renderTasks('all');
});