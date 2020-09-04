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

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const toISO = date => {
    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        '+00:00';
}

export default {
    request,
    toISO
};