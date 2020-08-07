import React from 'react';
import ReactLoading from 'react-loading';

const Loading = () => (
    <div style={{ 
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
     }}>
        <ReactLoading type={'spin'} color={'#dddddd'} height={100} width={100} />
    </div>
);

export default Loading;
