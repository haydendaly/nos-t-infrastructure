import { useState } from 'react';
import _ from 'lodash';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import helper from './helper';

const api_host = process.env.API_HOST ? process.env.API_HOST : '127.0.0.1';
const api_port = process.env.API_PORT ? process.env.API_PORT : 3000;
const api_ws_port = process.env.API_WS_PORT ? process.env.API_WS_URL : 2000;
const host = process.env.BROKER_HOST ? process.env.BROKER_HOST : 'testbed.code-lab.org';
const port = process.env.BROKER_PORT ? process.env.BROKER_PORT : 1883;
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
    // const [clientState, setClientState] = useState(false);

    // const client = new W3CWebSocket(`ws://${host}:${api_ws_port}`);

    // const startClient = () => {
    //     if (!clientState && key === 'logs') {
    //         setClientState(true);
    //         client.onopen = () => {
    //             console.log('WebSocket Client Connected');
    //         };
            // client.onmessage = data => {
            //     if (key === 'logs') {
            //         console.log(JSON.parse(_.get(data, 'data', '{}')));
            //         const tempLogs = logs;
            //         tempLogs = tempLogs.concat([{
            //             ...JSON.parse(_.get(data, 'data', '{}')),
            //             time: Date.now().toString()
            //         }]);
            //         setLogs(_.uniqWith(tempLogs, _.isEqual));
            //     }
            // };
    //         client.onclose = () => {
    //             console.log('Websocket Client Closed');
    //         };
    //     };
    // };


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
        let d;
        d = new Date();
        d.setSeconds(d.getSeconds() + 30);
        const utc = d.toISOString();

        d.setSeconds(d.getSeconds() + 36000);
        const utcEnd = d.toISOString();

        if (action === 'start' && (simulationState === 'Stopped' || simulationState === 'Ready')) {
            let startTime = _.get(properties, 'startTime', utc);
            let simStartTime = _.get(properties, 'simStartTime', utc);
            let simStopTime = _.get(properties, 'simStopTime', utcEnd);
            let timeScalingFactor = _.get(properties, 'timeScalingFactor', 600);

            startTime = startTime !== null ? startTime : utc;
            simStartTime = simStartTime !== null ? simStartTime : utc;
            timeScalingFactor = timeScalingFactor !== null ? timeScalingFactor : 600;
            toggle(action, { ...properties, startTime, simStartTime, timeScalingFactor, simStopTime }, data => {
                setSimulationState('Running');
                callback(data);
            });
        } else if (action === 'stop' && (simulationState === 'Running')) {
            const simStopTime = _.get(properties, 'simStopTime', (new Date).toISOString());
            setSimulationState('Stopped');
            toggle(action, { ...properties, simStopTime }, data => callback(data));
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