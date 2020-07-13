const assert = require('assert');
const TinyDB = require('tinydb');
const fs = require('fs');
const { initDate, download } = require('./download');

let _db;

const initDb = callback => {
    if (_db) {
        console.warn("Db already initialized");
    } else {
        const date = initDate();
        if (!fs.existsSync('../logs/')) {
            fs.mkdirSync('../logs/');
        };
        fs.mkdirSync(`../logs/${date}`);
        _db = new TinyDB(`../logs/${date}/local.db`);
        _db.onReady = () => {
            _db.setInfo('title', 'Local db', (err, key, value) => {
                if (err) {
                    console.log(err);
                    return _db;
                };
                console.log(value, 'initialized');
            });
        }
    }
    return callback(null, _db);
};

const getDb = () => {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
};

const findById = (id, callback) => {
    const db = getDb();
    db.findById(id, (err, data) => {
        callback(data);
    });
};

const addLog = (topic, data, callback) => {
    const db = getDb();
    db.appendItem({
        ...data,
        topic,
        type: 'log',
        time: Date.now().toString()
    }, (err, data) => {
        if (topic === 'topic/init') {
            addComponent(data, callback);
        };
        callback(!err);
    });
};

const addComponent = (data, callback) => {
    const db = getDb();
    db.appendItem({
        ...data,
        type: 'component',
        time: Date.now().toString()
    }, (err, data) => {
        callback(!err);
    });
};

const getLogs = callback => {
    const db = getDb();
    db.find({ type: 'log' }, (err, data) => {
        if (err || data.length === 0) {
            callback([]);
        } else {
            callback(data.map(log => { 
                log.key = log._id;
                delete log.type;
                delete log._id;
                return log;
            }));
        };
    });
};

const getComponents = callback => {
    const db = getDb();
    db.find({ type: 'component' }, (err, data) => {
        if (err || data.length === 0) {
            console.log(err)
            callback([]);
        } else {
            callback(data.map(component => { 
                component.key = component._id;
                delete component.type;
                delete component._id;
                return component;
            }));
        };
    });
};

const downloadLogs = (callback, specific=['xlsx', 'json', 'csv']) => {
    console.log('\nDownloading logs ...');
    getLogs(async data => {
        if (data.length !== 0 && specific.length !== 0) {
            download(data, specific).then(callback);
        } else {
            callback();
        };
    });
};

module.exports = {
    initDb,
    addLog,
    getLogs,
    getComponents,
    downloadLogs
};