import React, { useEffect, lazy, Suspense } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Loading from './Global/Loading';
const Dashboard = lazy(() => import('./Dashboard'));
const Logs = lazy(() => import('./Logs'));
const Documentation = lazy(() => import('./Documentation'));
import control from '../functions/control';
import '../styles/style.scss';

function App() {
    const {
        key,
        setKey,
        logs,
        wsLogs,
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
        <Suspense fallback={<Loading />}>
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
            {key === 'dashboard' ? <Dashboard components={components} simulationState={simulationState} toggleSimulation={toggleSimulation} /> : false}
            {key === 'logs' ? <Logs logs={logs} wsLogs={wsLogs} updateLogs={updateLogs} /> : false}
            {key === 'documentation' ? <Documentation /> : false}
        </Suspense>
    );
};

const selected = { backgroundColor: '#4f8de9', borderTopLeftRadius: 2, borderTopRightRadius: 2, height: 2.5 };

export default App;