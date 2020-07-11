import { useState } from 'react';

const url = process.env.API_URL ? process.env.API_URL : 'http://localhost:3000';

const request = (url, type="GET", send, body=null, defaultValue={}) => {
    body = body ? { body: JSON.stringify(body) } : {};
    fetch(
        url,
        { 
            method: type, 
            ...body,
            headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json'
            }
        }
    )
        .then(res => res.json())
        .then(response => { 
            send(response);
        })
        .catch(err => {
            console.log(JSON.stringify(err));
            send(defaultValue);
        });
}

const start = (simSpeed, callback) => {
    request(
        `${url}/start`,
        'POST',
        response => callback(response),
        { simSpeed },
        {}
    );
};


const stop = callback => {
    request(
        `${url}/stop`,
        'POST',
        response => callback(response),
        null,
        {}
    );
};

const getLogs = (after, callback) => {
    request(
        `${url}/logs` + (after > 0 ? `?after=${after}` : ''),
        'GET',
        response => callback(response),
        null,
        []
    );
};

const getComponents = callback => {
    request(
        `${url}/components`,
        'GET',
        response => callback(response),
        null,
        []
    );
}

function useControlState() {
    const [key, setKey] = useState("dashboard");
    const [logs, setLogs] = useState([]);
    const [components, setComponents] = useState([]);
    const [simulationState, setSimulationState] = useState('Loading');

    const updateLogs = () => {
        if (key === 'logs') {
            // const len = logs.length;
            // control.getLogs(len, data => {
            //     setLogs(logs.slice(len, logs.length).concat(data));
            // });
            getLogs(0, data => {
                setLogs(data);
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
            start(...simSpeed, data => {
                setSimulationState('Running');
                callback(data)
            });
        } else if (action === 'stop' && (simulationState === 'Running')) {
            setSimulationState('Stopped');
            stop(data => callback(data));
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