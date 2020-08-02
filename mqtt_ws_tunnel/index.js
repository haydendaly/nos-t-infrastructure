const WebSocket = require('ws');
const mqtt = require('mqtt');
const uuid = require('uuid');

const host = process.env.BROKER_HOST ? process.env.BROKER_HOST : 'testbed.code-lab.org';
const port = process.env.BROKER_PORT ? process.env.BROKER_PORT : 1883;

const wss = new WebSocket.Server({ port: 2000 });
const client = mqtt.connect({ host, port });

client.on('connect', () => {
    console.log('Tunnel opened');
    client.subscribe('topic/#');
});

client.on('message', (topic, message) => {
    let obj = JSON.parse(message.toString());
    wss.clients.forEach(function each(connection) {
        if (connection.readyState === WebSocket.OPEN) {
            connection.send(JSON.stringify({
                ...obj,
                key: uuid.v4(),
                topic
            }));
        }
    });
});