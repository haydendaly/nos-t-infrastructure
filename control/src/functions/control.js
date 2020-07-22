import { useState } from 'react';
import _ from 'lodash';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import helper from './helper';

const api_host = process.env.API_HOST ? process.env.API_HOST : '127.0.0.1';
const api_port = process.env.API_PORT ? process.env.API_URL : 3000;
const api_ws_port = process.env.API_PORT ? process.env.API_URL : 2000;
const host = process.env.HOST_URL ? process.env.HOST_URL : 'testbed.code-lab.org';
const port = process.env.HOST_PORT ? process.env.HOST_PORT : 1883;
const url = `http://${api_host}:${api_port}`;


const toggle = (type, properties, callback) => {
    helper.request(
        `${url}/${type}`,
        'POST',
        response => callback(response),
        properties,
        {}
    );
};

const getLogs = (init, callback) => {
    helper.request(
        `${url}/logs` + (init ? `?init=${init}` : ''),
        'GET',
        response => callback(response),
        null,
        []
    );
};

const getComponents = callback => {
    helper.request(
        `${url}/components`,
        'GET',
        response => callback(response),
        null,
        []
    );
};

function useControlState() {
    const [key, setKey] = useState("dashboard");
    const [logs, setLogs] = useState([]);
    const [components, setComponents] = useState([]);
    const [simulationState, setSimulationState] = useState('Ready');
    const [init, setInit] = useState(true);
    const [clientState, setClientState] = useState(false);

    const client = new W3CWebSocket(`ws://${api_host}:${api_ws_port}`);

    const startClient = () => {
        if (!clientState && key === 'logs') {
            setClientState(true);
            client.onopen = () => {
                console.log('WebSocket Client Connected');
            };
            client.onmessage = data => {
                if (key === 'logs') {
                    const tempLogs = logs;
                    tempLogs = tempLogs.concat([{
                        ...JSON.parse(_.get(data, 'data', '{}')),
                        time: Date.now().toString()
                    }]);
                    setLogs(_.uniqWith(tempLogs, _.isEqual));
                }
            };
            client.onclose = () => {
                console.log('Websocket Client Closed');
            };
        };
    };


    const updateLogs = () => {
        if (key === 'logs') {
            getLogs(init, data => {
                data = logs.concat(data);
                setLogs(_.uniqWith(data, _.isEqual));
                setInit(false);
                // startClient();
            });
        };
    };

    const updateComponents = () => {
        if (key === 'dashboard') {
            getComponents(data => {
                setComponents(data);
            });
        };
    };

    const update = () => {
        updateLogs();
        updateComponents();
    };

    const toggleSimulation = (action, properties = {}, callback = () => false) => {
        if (action === 'start' && (simulationState === 'Stopped' || simulationState === 'Ready')) {
            const startTime = _.get(properties, 'startTime', (new Date).toISOString());
            const simStartTime = _.get(properties, 'simStartTime', (new Date).toISOString());
            const timeScalingFactor = _.get(properties, 'timeScalingFactor', 1);
            toggle(action, { startTime, simStartTime, timeScalingFactor, ...properties }, data => {
                setSimulationState('Running');
                callback(data);
            });
        } else if (action === 'stop' && (simulationState === 'Running')) {
            const stopTime = _.get(properties, 'stopTime', (new Date).toISOString());
            setSimulationState('Stopped');
            toggle(action, { stopTime, ...properties }, data => callback(data));
        };
    };

    return {
        key,
        setKey,
        logs,
        components,
        updateLogs,
        update,
        simulationState,
        toggleSimulation
    };
};

export default {
    useControlState
};