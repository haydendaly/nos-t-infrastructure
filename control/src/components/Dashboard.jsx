import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/style.scss';

function Dashboard(props) {

    return (
        <div>
            <Container
                className="component-table shadow-reg my-4"
            >
                <div style={{ height: 300 }}>Dashboard</div>
            </Container>
        </div>
    );
};

export default Dashboard;