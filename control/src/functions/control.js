import { useState } from 'react';
import _ from 'lodash';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import helper from './helper';

const api_host = process.env.API_HOST ? process.env.API_HOST : '127.0.0.1';
const api_port = process.env.API_PORT ? process.env.API_PORT : 3000;
const ws_host = process.env.WS_HOST ? process.env.WS_HOST : '127.0.0.1';
const ws_port = process.env.WS_PORT ? process.env.WS_PORT : 2000;
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
    const [wsLogs, setWsLogs] = useState([]);
    const [components, setComponents] = useState([]);
    const [simulationState, setSimulationState] = useState('Ready');
    const [init, setInit] = useState(true);
    const [clientState, setClientState] = useState(false);

    const client = new W3CWebSocket(`ws://${ws_host}:${ws_port}`);

    const startClient = () => {
        if (!clientState && key === 'logs') {
            setClientState(true);
            client.onopen = () => {
                console.log('WebSocket Client Connected');
            };
            client.onmessage = data => {
                if (key === 'logs') {
                    setWsLogs(prev => [...prev, {
                        ...JSON.parse(_.get(data, 'data', '{}')),
                        time: Date.now().toString()
                    }]);
                }
            };
            client.onclose = () => {
                console.log('Websocket Client Closed');
                setClientState(false);
            };
        };
    };


    const updateLogs = (callback=_.noop) => {
        if (key === 'logs') {
            getLogs(init, data => {
                setLogs(prev => [...prev, ...data]);
                setWsLogs([]);
                setInit(false);
                callback && callback();
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
        updateLogs(() => {
            startClient();
        });
        updateComponents();
    };

    const toggleSimulation = (action, properties = {}, callback = () => false) => {
        let d, d2;
        d = new Date();
        d.setSeconds(d.getSeconds() + 30);
        const utc = helper.toISO(d);

        // back one day
        d2 = new Date();
        d2.setSeconds(d2.getSeconds() - 604800)
        const utcPast = helper.toISO(d2);

        d2.setSeconds(d2.getSeconds() + 86400);
        const utcEnd = helper.toISO(d2);

        if (action === 'start' && (simulationState === 'Stopped' || simulationState === 'Ready')) {
            let startTime = _.get(properties, 'startTime', utc);
            let simStartTime = _.get(properties, 'simStartTime', utcPast);
            let simStopTime = _.get(properties, 'simStopTime', utcEnd);
            let timeScalingFactor = _.get(properties, 'timeScalingFactor', 2);

            startTime = startTime !== null ? startTime : utc;
            simStartTime = simStartTime !== null ? simStartTime : utcPast;
            simStopTime = simStopTime !== null ? simStopTime : utcEnd;
            timeScalingFactor = timeScalingFactor !== null ? timeScalingFactor : 2;
            toggle(action, { ...properties, startTime, simStartTime, timeScalingFactor, simStopTime }, data => {
                setSimulationState('Running');
                callback(data);
            });
        } else if (action === 'stop' && (simulationState === 'Running')) {
            const now = helper.toISO(new Date)
            let simStopTime = _.get(properties, 'simStopTime', now);
            simStopTime = simStopTime !== null ? simStopTime : now;
            setSimulationState('Stopped');
            toggle(action, { ...properties, simStopTime }, data => callback(data));
        };
    };

    return {
        key,
        setKey,
        logs,
        wsLogs,
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