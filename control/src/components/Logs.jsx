import React from 'react';
import { Container } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import _ from 'lodash';
import JSONCell from './LogsComponents/JSONCell';
import Button from './Global/Button';
import '../styles/style.scss';
import { colorBrewer } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Logs({ logs, updateLogs }) {
    let cleanLogs = _.uniqBy(logs, log => log.key);
    cleanLogs = _.uniqBy(logs, log => log.topic + log.name + log.time);
    let data = cleanLogs.map(log => {
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
            <div
                className='table-container shadow-reg my-4'
            >
                <div style={{ display: 'flex' }} className="table-header-buttons pt-2 px-2">
                    <div style={{ marginLeft: 'auto' }}>
                        <Button variant="success" func={updateLogs} text="Refresh" />
                        <Button variant="primary" func={() => window.open('http://0.0.0.0/api/download')} text="Download Logs" />
                    </div>
                </div>
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
                >
                    <THC isKey dataField='key' hidden></THC>
                    <THC dataField='time'
                        thStyle={header}
                        tdStyle={textSmall}
                        width='120'
                        dataSort
                        defaultSortOrder='asc'
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
                        dataFormat={cell => <JSONCell cell={cell} />}
                    >
                        Message
                        </THC>
                </BootstrapTable>
                <div style={{ display: 'flex' }} className="table-footer-text shadow-reg py-1 px-3">
                    <span style={{ fontSize: 12, color: '#787878', marginLeft: 'auto' }}>{data.length} Logs</span>
                </div>
            </div>
        </Container>
    );
};

const header = { fontSize: 14, fontWeight: '400', color: '#787878' };
const text = { fontSize: 13, fontWeight: '300', color: '#787878' };
const textSmall = { fontSize: 12, fontWeight: '400', color: '#787878' };

export default Logs;