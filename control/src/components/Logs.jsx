import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/style.scss';

function Logs({ logs }) {

    return <div>
        <Container
            className="component-table shadow-reg my-4"
        >
            {logs.map(o => (
                <span key={o.key}>{JSON.stringify(o)}</span>
            ))}
        </Container>
    </div>
};

export default Logs;