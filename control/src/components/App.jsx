import React, { useEffect } from 'react';
import { Nav } from 'react-bootstrap';

import Dashboard from './Dashboard';
import Logs from './Logs';
import Documentation from './Documentation';
import control from '../functions/control';
import '../styles/style.scss';

function App(props) {
    const {
        key,
        setKey,
        logs,
        components,
        updateLogs,
        updateComponents,
        simulationState,
        toggleSimulation
    } = control.useControlState();

    useEffect(() => {
        updateLogs();
        updateComponents();
    }, [key]);

    return (
        <div>
            <Nav
                activeKey={key}
                onSelect={setKey}
                className="mx-4 navbar-custom"
                variant="tabs"
            >
                <Nav.Item className="item">
                    <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item className="item">
                    <Nav.Link eventKey="logs">Logs</Nav.Link>
                </Nav.Item>
                <Nav.Item className="item">
                    <Nav.Link eventKey="documentation">Documentation</Nav.Link>
                </Nav.Item>
            </Nav>
            {key === 'dashboard' ? <Dashboard components={components} simulationState={simulationState} toggleSimulation={toggleSimulation} /> : false}
            {key === 'logs' ? <Logs logs={logs} /> : false}
            {key === 'documentation' ? <Documentation /> : false}
        </div>
    );
};

export default App;