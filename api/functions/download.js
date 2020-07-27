const json2xlsx = require('node-json-xlsx');
const fs = require('fs');
const _ = require('lodash');
const assert = require('assert');

let _date;

const initDate = () => {
    if (_date) {
        console.warn("Date already initialized");
    }
    _date = Date.now().toString();
    return _date;
};

const getDate = () => {
    assert.ok(_date, "Date has not been initialized. Please call init first.");
    return _date;
};

const downloadFile = (data, type) => {
    return new Promise(resolve => {
        if (type === 'xlsx') {
            fs.writeFileSync(
                `../logs/${_date}/log.xlsx`,
                json2xlsx(data, {
                    fields: ['time', 'name', 'topic', 'description', 'properties'],
                    fieldNames: ['Time', 'Source', 'Topic', 'Description', 'Properties']
                }),
                'binary'
            );
            resolve(true);
            return;
        } else if (type === 'json') {
            fs.writeFileSync(`../logs/${_date}/log.json`, JSON.stringify(data, null, 4));
            resolve(true);
            return;
        } else if (type === 'csv') {
            let header = Object.getOwnPropertyNames(data[0]);
            let body = data.map(log => {
                return header.map(key => {
                    let field = _.get(log, key, '');
                    if (typeof field !== 'string') {
                        field = JSON.stringify(field);
                    }
                    return field;
                }).join(',')
            });
            const csv = [header.join(','), ...body].join('\n');
            fs.writeFileSync(`../logs/${_date}/log.csv`, csv, 'utf8');
            resolve(true);
            return;
        } else {
            resolve(false);
        };
    });
};

const downloadPromises = (data, specific) => {
    const promises = [];
    for (var type in specific) {
        promises.push(downloadFile(data, specific[type]));
    };
    return Promise.all(promises);
};

const download = async (data, specific) => {
    let p = Promise.resolve();
    p = p.then(() => {
        return downloadPromises(data, specific);
    });
};

module.exports = {
    initDate,
    getDate,
    download
};