import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
const MD = require('react-markdown');
import CodeBlock from './DocumentationComponents/CodeBlock';
import documentation from '../functions/documentation';
import '../styles/style.scss';

function Image(props) {
    return (
        <img {...props} style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
    );
};

function InlineCode(props) {
    return (
        <span {...props} className='shadow-regular' style={{ color:  '#2b3c57', fontFamily: "Menlo, Monaco, \"Courier New\", monospace", fontSize: 14, padding: 6, backgroundColor: '#fafafa', borderRadius: 5
    }}/>
    );
};

function Documentation(props) {
    const {
        terms,
        updateTerms,
        page,
        setPage
    } = documentation.useDocumentation();

    useEffect(() => {
        updateTerms();
    }, [page]);

    return (
        <Container
            className="component-table shadow-reg my-4 content doc-container"
        >
            <div>
                <Button variant="primary" onClick={() => setPage('DOCUMENTATION')}>
                    Documentation
                </Button>
                <Button variant="primary" onClick={() => setPage('README')}>
                    Getting Started
                </Button>
                <Button variant="primary" onClick={() => setPage('TODO')}>
                    To-Do
                </Button>
            </div>
            <MD
                className='my-3 mx-3'
                source={terms}
                renderers={{ image: Image, code: CodeBlock, inlineCode: InlineCode }}
            />
        </Container>
    );
};

export default Documentation;