const request = (url, type="GET", send, body=null, defaultValue={}, format='json') => {
    body = body ? { body: JSON.stringify(body) } : {};
    fetch(
        url,
        { 
            method: type, 
            ...body,
            headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json'
            }
        }
    )
        .then(res => {
            if (format === 'json') {
                return res.json();
            } else {
                return res.text();
            };
        })
        .then(response => { 
            send(response);
        })
        .catch(err => {
            console.log(JSON.stringify(err));
            send(defaultValue);
        });
};

export default {
    request
};