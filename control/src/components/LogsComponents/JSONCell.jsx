import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';
const theme = require('../../styles/jsonpretty.css');

function JSONCell({ cell }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            onClick={() => setOpen(!open) }
        >
            {
                open ? (
                    <JSONPretty data={cell} theme={theme}></JSONPretty>
                ) : (
                    <span className='table-row-text-small'>{JSON.stringify(cell, null, 2)}</span>
                )
            }
        </div>
    );
};

export default JSONCell;