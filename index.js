import http from 'http';
import { v4 } from 'uuid';

const port = 3000;
const tasks = [];

const server = http.createServer((request, response) => {
   
    const { method, url } = request;
    
    let body = '';

    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', () => {
        
        const urlParts = url.split('/');
        const isTaskWithId = urlParts.length === 3 && urlParts[1] === 'tasks';
        const id = isTaskWithId ? urlParts[2] : null;

        if (url === '/tasks' && method === 'GET') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(tasks));

   
        } else if (url === '/tasks' && method === 'POST') {
            const { title, description, status } = JSON.parse(body);
            const newTask = { id: v4(), title, description, status };
            tasks.push(newTask);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(newTask));

  
        } else if (isTaskWithId && method === 'PUT') {
            const { title, description, status } = JSON.parse(body);
            const taskToUpdate = tasks.find(task => task.id === id);

            if (taskToUpdate) {
                taskToUpdate.title = title;
                taskToUpdate.description = description;
                taskToUpdate.status = status;
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(taskToUpdate));
            } else {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Task not found' }));
            }

        } else if (isTaskWithId && method === 'DELETE') {
            const index = tasks.findIndex(task => task.id === id);

            if (index !== -1) {
                tasks.splice(index, 1);
                response.writeHead(204);
                response.end();
            } else {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Task not found' }));
            }

        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Route not found' }));
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});