const mqtt = require('mqtt');
const assert = require("assert");
const { addLog } = require('./db');

const header = {
    name : "api",
    description : "Interfaces the simulation with the user allowing for API and GUI control.",
    properties : {}
};

let _client;

const initClient = (host, port, callback) => {
    if (_client) {
        console.warn("Client already initialized");
    } else {
        _client = mqtt.connect({ host, port });
        _client.on('connect', () => {
            console.log("Client initialized");
            _client.subscribe('topic/#');
        });

        _client.on('message', (topic, message) => {
            addLog(topic, JSON.parse(message.toString()), data => {});
        });
    }
    return callback(null, _client);
};

const getClient = () => {
    assert.ok(_client, "Client has not been initialized. Please call init first.");
    return _client;
};

const toggle = (type, params, callback) => {
    if (type !== 'start' && type !== 'stop') {
        callback(false);
    }
    const client = getClient();
    client.publish('topic/control', JSON.stringify({ 
        ...header,
        time: Math.round((new Date()).getTime() / 1000),
        properties: { 
            type: type,
            ...params
        }
    }), err => callback(!err));
};

module.exports = {
    initClient,
    getClient,
    toggle
};