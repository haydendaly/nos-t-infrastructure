import { useState } from 'react';
import _ from 'lodash';
import helper from './helper';

const url = process.env.API_URL ? process.env.API_URL : 'http://localhost:3000';

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
    const [simulationState, setSimulationState] = useState('Loading');
    const [init, setInit] = useState(true);

    const updateLogs = () => {
        if (key === 'logs') {
            getLogs(init, data => {
                data = logs.concat(data);
                setLogs(_.uniqWith(data, _.isEqual));
                setInit(false);
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

    const toggleSimulation = (action, callback, properties={}) => {
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
        updateLogs,
        updateComponents,
        simulationState,
        toggleSimulation
    };
};

export default {
    useControlState
};