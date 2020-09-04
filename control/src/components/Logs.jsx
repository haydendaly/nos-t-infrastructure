import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import Select from 'react-select';
import _ from 'lodash';
import JSONCell from './LogsComponents/JSONCell';
import Button from './Global/Button';
import '../styles/style.scss';

function Logs({ logs, wsLogs, updateLogs }) {
    const [showing, setShowing] = useState(50);
    const [keys, setKeys] = useState([]);

    let cleanLogs = _.uniqBy([...logs, ...wsLogs], log => log.key);

    // not great practice but accounts for messages with slightly different UNIX timestamps coming from control / WS to negate duplicates
    cleanLogs = _.uniqBy(cleanLogs, log => log.topic + log.name + log.time.substring(0, log.time.length - 2) + JSON.stringify(log.properties));

    let data = cleanLogs.map(log => {
        let time = new Date(parseInt(log.time)).toLocaleTimeString();

        let reducedLog = Object.assign({}, log);
        delete reducedLog.time;
        delete reducedLog.name;
        delete reducedLog.description;
        delete reducedLog.topic;

        return {
            key: log.key,
            time,
            source: log.name,
            topic: log.topic,
            message: reducedLog
        };
    });

    const populateOptions = len => {
        let options = [];
        for (let i = 50; i < (len + 51); i = i + 50) {
            options.push({ value: i, label: "Showing " + i + " Logs" });
        }
        return options;
    }

    return (
        <Container>
            <div
                className='table-container shadow-reg my-4'
            >
                <div style={{ display: 'flex' }} className="table-header-buttons px-2">
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                        <Select
                            value={showing}
                            placeholder={"Showing 50 Logs"}
                            onChange={setShowing}
                            options={populateOptions(data.length)}
                            isSearchable={false}
                            styles={styles}
                        />
                    </div>
                    <div style={{ marginLeft: 'auto' }} className="py-2">
                        <Button variant="success" func={updateLogs} text="Refresh" />
                        <Button variant="primary" func={() => window.open('http://0.0.0.0/api/download')} text="Download Logs" />
                    </div>
                </div>
                <BootstrapTable
                    data={data.length < 50 ? data : data.slice(data.length - showing - 1, data.length - 1)}
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
                        dataFormat={cell => <JSONCell cell={cell} keys={keys} setKeys={setKeys} />}
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

const styles = {
    control: provided => ({
        ...provided,
        ...header,
        backgroundColor: 'none',
        border: '0 !important',
        boxShadow: 'none',
        width: ("Showing 1000 Logs").length * 12,
        '&:hover' : {
            ...header,
            border: '0 !important'
        }
    }),
    valueContainer: provided => ({
        ...provided,
        ...header,
    }),
    dropdownIndicator: provided => ({
        ...provided,
        color: '#787878',
    }),
    indicatorSeparator: () => ({
        backgroundColor: 'none',
        color: 'none',
    }),
    singleValue: provided => ({
        ...provided,
        ...header,
    }),
    option: provided => ({
        ...provided,
        ...text,
        '&hover' : {
        },
    }),
    menu: provided => ({
        ...provided,
        backgroundColor: '#fafafa',
    })
}

const header = { fontSize: 14, fontWeight: '400', color: '#787878' };
const text = { fontSize: 13, fontWeight: '300', color: '#787878' };
const textSmall = { fontSize: 12, fontWeight: '400', color: '#787878' };

export default Logs;