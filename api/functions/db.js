const assert = require('assert');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const fs = require('fs');
const uuid = require('uuid');
const { initDate, download } = require('./download');

let _db;

const initDb = callback => {
    if (_db) {
        console.warn("Db already initialized");
        return callback(null, _db);
    } else {
        const date = initDate();
        if (!fs.existsSync('../logs/')) {
            fs.mkdirSync('../logs/');
        };
        fs.mkdirSync(`../logs/${date}`);
        adapter = new FileAsync(`../logs/${date}/local.db`);
        low(adapter).then(db => {
            _db = db;
            _db.defaults({ logs: [], components: [] })
                .write()
                .then(() => {
                    console.log('Db initialized')
                    return callback(null, _db);
                });
        });
    };
};

const getDb = () => {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
};

const addLog = (topic, data, callback) => {
    const db = getDb();
    db.get('logs')
        .push({
            ...data,
            topic,
            time: Date.now().toString()
        })
        .last()
        .assign({ id: uuid.v4() })
        .write()
        .then(post => {
            if (topic === 'topic/init') {
                addComponent(data, callback);
            } else {
                callback(post);
            }
        });
};

const addComponent = (data, callback) => {
    const db = getDb();
    db.get('components')
        .push({
            ...data,
            time: Date.now().toString()
        })
        .last()
        .assign({ id: uuid.v4() })
        .write()
        .then(post => callback(post));
};

const getLogs = callback => {
    const db = getDb();
    const data = db.get('logs')
        .value();
    callback(data.map(log => {
        log.key = log.id;
        delete log.id;
        return log;
    }));
};

const getComponents = callback => {
    const db = getDb();
    const data = db.get('components')
        .value();
    callback(data.map(component => {
        component.key = component.id;
        delete component.id;
        return component;
    }));
};

const downloadLogs = (callback, specific = ['xlsx', 'json', 'csv']) => {
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