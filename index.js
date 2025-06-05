import http from 'http'

const port = 3000;

const tasks = [];

const server = http.createServer((request, response) => {

    const {method, url} = request;

    if (url === '/tasks' && method === 'GET') {

        response.writeHead(200, {"Content-Type": 'application.json'});
        response.end(JSON.stringify(tasks));
    }

});

server.listen(port, () => {
console.log(`Server running on port ${port}`);
});

