const mqtt = require('mqtt');

const wsHandler = (host, port, ws) => {
    const client = mqtt.connect({ host, port });
    client.on('connect', () => {
        console.log('Mqtt -> websocket tunnel opened');
        client.subscribe('topic/#');
    });

    client.on('message', (topic, message) => {
        let obj = JSON.parse(message.toString())
        ws.send(JSON.stringify({
            ...obj,
            topic
        }))
    });
}

module.exports = {
    wsHandler
}