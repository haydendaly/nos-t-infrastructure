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
                    tempLogs.concat([{
                        ...JSON.parse(_.get(data, 'data', '{}')),
                        time: Date.now().toString()
                    }]);
                    setLogs(_.uniqWith(tempLogs, _.isEqual));
                }
            };
            client.onclose = () => {
                setTimeout(() => {
                    console.log('Websocket Client Closed');
                    startClient();
                }, 10000);
            };
        };
    };


    const updateLogs = () => {
        if (key === 'logs' && init) {
            getLogs(init, data => {
                data = logs.concat(data);
                setLogs(_.uniqWith(data, _.isEqual));
                setInit(false);
                startClient();
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

    const toggleSimulation = (action, callback, properties = {}) => {
        if (action === 'start' && (simulationState === 'Stopped' || simulationState === 'Ready')) {
            const simSpeed = _.get(properties, simSpeed, 1);
            toggle(action, { simSpeed, ...properties }, data => {
                setSimulationState('Running');
                callback(data);
            });
        } else if (action === 'stop' && (simulationState === 'Running')) {
            setSimulationState('Stopped');
            toggle(action, properties, data => callback(data));
        };
    };

    return {
        key,
        setKey,
        logs,
        components,
        update,
        simulationState,
        toggleSimulation
    };
};

export default {
    useControlState
};