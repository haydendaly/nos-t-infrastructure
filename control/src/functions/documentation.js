import { useState } from 'react';
import _ from 'lodash';
import helper from './helper';

const url = process.env.API_URL ? process.env.API_URL : 'http://localhost:3000';

const getResource = (filename, callback) => {
    helper.request(
        `${url}/resource/${filename}`,
        'GET',
        response => callback(response),
        null,
        null,
        'txt'
    );
};

function useDocumentation() {
    const [terms, setTerms] = useState('# Hello');
    const [page, setPage] = useState('DOCUMENTATION');

    const updateTerms = () => {
        getResource(page, data => {
            if (data) {
                let cleanData = data.replace('RESOURCE_URL', url);
                setTerms(cleanData);
            };
        });
    };

    updateTerms();

    return {
        terms,
        updateTerms,
        page,
        setPage
    };
};

export default { 
    useDocumentation 
};
