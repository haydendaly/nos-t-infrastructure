import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
const MD = require('react-markdown');
import Button from './Global/Button';
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
        <span {...props} className='shadow-regular' style={{
            color: '#2b3c57', fontFamily: "Menlo, Monaco, \"Courier New\", monospace", fontSize: 14, padding: 6, backgroundColor: '#fafafa', borderRadius: 5
        }} />
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
        <Container>
            <div className="component-table shadow-reg my-4 content doc-container" style={{ overflow: 'hidden' }}>
                <div className="py-2 px-2 table-header shadow-reg">
                    <Button variant="info" func={() => setPage('README')} text="Getting Started" />
                    <Button variant="danger" func={() => setPage('DOCUMENTATION')} text="Documentation" />
                </div>
                <MD
                    className='mt-2 mb-3 mx-3'
                    source={terms}
                    renderers={{ image: Image, code: CodeBlock, inlineCode: InlineCode }}
                />
            </div>
        </Container>
    );
};

export default Documentation;