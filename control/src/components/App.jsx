import React, { useEffect } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

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
        update,
        simulationState,
        toggleSimulation
    } = control.useControlState();

    useEffect(() => {
        update();
    }, [key]);

    return (
        <div>
            <Nav
                activeKey={key}
                onSelect={setKey}
                className="mx-4 navbar-custom"
                variant="tabs"
            >
                <NavItem>
                    <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                    <div style={key === "dashboard" ? selected : { height: 2.5 }} />
                </NavItem>
                <NavItem>
                    <Nav.Link eventKey="logs">Logs</Nav.Link>
                    <div style={key === "logs" ? selected : { height: 2.5 }} />
                </NavItem>
                <NavItem>
                    <Nav.Link eventKey="documentation">Documentation</Nav.Link>
                    <div style={key === "documentation" ? selected : { height: 2.5 }} />
                </NavItem>
            </Nav>
            {key === 'dashboard' ? <Dashboard components={components} simulationState={simulationState} toggleSimulation={toggleSimulation}/> : false}
            {key === 'logs' ? <Logs logs={logs} updateLogs={updateLogs} /> : false}
            {key === 'documentation' ? <Documentation /> : false}
        </div>
    );
};

const selected = { backgroundColor: '#4f8de9', borderTopLeftRadius: 2, borderTopRightRadius: 2, height: 2.5 };

export default App;