import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import JSONPretty from 'react-json-pretty';
const theme = require('../styles/jsonpretty.css');
import '../styles/style.scss';

function JSONCell(cell, row, chosen, setChosen) {
    return (
        <div
            onClick={() => rowClick(row, chosen, setChosen)}
        >
            {
                chosen.includes(row.key) ? (
                    <JSONPretty data={cell} theme={theme}></JSONPretty>
                ) : (
                        <span className='table-row-text-small'>{JSON.stringify(cell, null, 2)}</span>
                    )
            }
        </div>
    );
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

function Logs({ logs, updateLogs }) {
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
        <div>
            <Container>
                <Button variant="secondary" onClick={() => updateLogs()}>
                    Refresh
                </Button>
            </Container>
            <Container>
                <BootstrapTable
                    data={data}
                    bordered={false}
                    height={data.length > 14 ? '600' : undefined}
                    bodyStyle={{ overflow: 'overlay' }}
                    scrollTop={'Bottom'}
                    options={{ noDataText: 'No logs yet, start the simulation!' }}
                    version='4'
                    hover
                    headerContainerClass='table-header'
                    className='table-container shadow-reg my-4'
                >
                    <THC isKey dataField='key' hidden></THC>
                    <THC dataField='time'
                        thStyle={header}
                        tdStyle={textSmall}
                        width='120'
                        dataSort
                        defaultSortOrder='desc'
                    >
                        Time
                </THC>
                    <THC dataField='source'
                        thStyle={header}
                        tdStyle={text}
                        width='170'
                        dataSort
                    >
                        Source
                </THC>
                    <THC dataField='topic'
                        thStyle={header}
                        tdStyle={text}
                        width='140'
                        dataSort>
                        Topic
                </THC>
                    <THC dataField='message'
                        thStyle={header}
                        tdStyle={text}
                        dataFormat={(cell, row) => JSONCell(cell, row, chosen, setChosen)}
                    >
                        Message
                </THC>
                </BootstrapTable>
            </Container>
        </div >
    );
};

const header = { fontSize: 14, fontWeight: '400', color: '#787878' };
const text = { fontSize: 13, fontWeight: '300', color: '#787878' };
const textSmall = { fontSize: 12, fontWeight: '400', color: '#787878' };

export default Logs;