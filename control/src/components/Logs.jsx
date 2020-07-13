import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import JSONPretty from 'react-json-pretty';
const theme = require('../styles/jsonpretty.css');
import '../styles/style.scss';

function JSONCell(cell, row, chosen, setChosen) {
    console.log("cell called")
    return (
        <div
            onClick={() => rowClick(row, chosen, setChosen)}
        >
            {
                chosen.includes(row.key) ? (
                    <JSONPretty data={cell} theme={theme}></JSONPretty>
                ) : (
                        <span style={{ ...text, fontSize: 13 }}>{JSON.stringify(cell, null, 2)}</span>
                    )
            }
        </div>
    )
};

function rowClick(row, chosen, setChosen) {
    if (chosen.includes(row.key)) {
        setChosen(chosen.filter(key => key !== row.key));
    } else {
        let tempChosen = chosen;
        tempChosen.push(row.key);
        setChosen(tempChosen);
    };
};

function Logs({ logs }) {
    const [chosen, setChosen] = useState([]);

    let data = logs.map(log => {
        let time = new Date(parseInt(log.time)).toLocaleTimeString();

        let reducedLog = Object.assign({}, log);
        delete reducedLog.time;
        delete reducedLog.name;
        delete reducedLog.description;
        delete reducedLog.key;
        delete reducedLog.topic;

        return {
            key: log.key,
            time,
            source: log.name,
            topic: log.topic,
            message: reducedLog
        };
    });

    return (
        <Container>
            <BootstrapTable
                data={data}
                bordered={false}
                height='600'
                bodyStyle={{ overflow: 'overlay' }}
                scrollTop={'Bottom'}
                options={{ noDataText: 'No logs yet, start the simulation!' }}
                version='4'
                hover
                headerContainerClass='log-table-header'
                className='table-container shadow-reg my-4'
            >
                <THC isKey dataField='key' hidden></THC>
                <THC dataField='time' style={headerColumn} thStyle={header} trStyle={row} tdStyle={{ ...text, fontWeight: 12, fontWeight: '400' }} width='120' dataSort>Time</THC>
                <THC dataField='source' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='170'>Source</THC>
                <THC dataField='topic' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='160'>Topic</THC>
                <THC dataField='message'
                    style={headerColumn} 
                    thStyle={header}
                    trStyle={row}
                    tdStyle={text}
                    dataFormat={(cell, row) => JSONCell(cell, row, chosen, setChosen)}
                >
                    Message
                </THC>
            </BootstrapTable>
        </Container>
    );
};

const headerColumn = { padding: 100};
const header = { fontSize: 14, fontWeight: '400', color: '#787878' };
const row = { margin: 5, backgroundColor: 'red' };
const text = { fontSize: 13, fontWeight: '300', color: '#787878' };

export default Logs;