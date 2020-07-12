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
                <NavItem style={nav} className="navitem">
                    <Nav.Link style={navText} eventKey="dashboard">Dashboard</Nav.Link>
                </NavItem>
                <NavItem style={nav} className="navitem">
                    <Nav.Link style={navText} eventKey="logs">Logs</Nav.Link>
                </NavItem>
                <NavItem style={nav} className="navitem">
                    <Nav.Link style={navText} eventKey="documentation">Documentation</Nav.Link>
                </NavItem>
            </Nav>
            {key === 'dashboard' ? <Dashboard components={components} simulationState={simulationState} toggleSimulation={toggleSimulation} /> : false}
            {key === 'logs' ? <Logs logs={logs} /> : false}
            {key === 'documentation' ? <Documentation /> : false}
        </div>
    );
};

const nav = {};
const navText = {
    color: '#496381'
}  

export default App;