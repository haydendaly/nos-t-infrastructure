import React from 'react';
import { Button as BSButton } from 'react-bootstrap';

function Button({ variant, func, text}) {
    return (
        <BSButton variant={variant} className="mx-1 shadow-reg" size="sm" onClick={func}>
            {text}
        </BSButton>
    );
}

export default Button;
