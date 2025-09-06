const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = [];

wss.on('connection', ws => {
    console.log('Client connected');
    clients.push(ws);

    ws.on('message', message => {
        const data = JSON.parse(message);
        console.log(`Received message: ${data.text}`);
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ text: data.text }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

app.use(express.static('public'));

// Sử dụng cổng được cung cấp bởi Render, hoặc cổng 3000 khi chạy cục bộ
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
