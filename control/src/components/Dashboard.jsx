import React, { useRef } from 'react';
import { Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import '../styles/style.scss';

function Dashboard({ components, simulationState, toggleSimulation }) {
    const startTime = useRef(null);
    const simStartTime = useRef(null);
    const timeScalingFactor = useRef(null);
    const stopTime = useRef(null);

    let data = components.map(component => {
        let subscriptions = _.get(component.properties, 'subscriptions');
        return {
            key: component.key,
            component: component.name,
            description: component.description,
            subscriptions: subscriptions ? subscriptions.join(', ') : 'None',
            resource: _.get(component.properties, 'resource', 'None'),
            type: _.get(component.properties, 'type', 'N/A'),
            status: simulationState
        };
    });

    return (
        <div>
            <Container
                style={{ overflow: 'hidden' }}
            >
                <div className="component-table shadow-reg mt-4 content doc-container">
                    <InputGroup className="m-3" style={{ width: '97%' }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{ ...header, backgroundColor: '#f7f7f7' }}>Initial Wallclock Time</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="ISO 8601"
                            onChange={event => startTime.current = event.target.value !== '' ? event.target.value : null}
                        />
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{ ...header, backgroundColor: '#f7f7f7' }}>Initial Sim. Time</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="ISO 8601"
                            onChange={event => simStartTime = event.target.value !== '' ? event.target.value : null}
                        />
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{ ...header, backgroundColor: '#f7f7f7' }}>Time Scaling Factor</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Floating-point number"
                            onChange={event => timeScalingFactor.current = event.target.value !== '' ? event.target.value : null}
                        />
                        <Button variant="success" className="ml-3" active={simulationState === 'Running'} onClick={() => {
                            toggleSimulation('start', {
                                startTime: startTime.current, 
                                simStartTime: simStartTime.current, 
                                timeScalingFactor: timeScalingFactor.current
                            }, data => console.log(data));
                        }}>
                            Start
                        </Button>
                    </InputGroup>
                    <InputGroup className="m-3" style={{ width: '97%' }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{ ...header, backgroundColor: '#f7f7f7' }}>Stop Wallclock Time</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="ISO 8601"
                            onChange={event => stopTime.current = event.target.value !== '' ? event.target.value : null}
                        />
                        <Button variant="danger" className="ml-3" active={simulationState === 'Ready' || simulationState === 'Stopped'} onClick={() => {
                            toggleSimulation('stop', {
                                stopTime: stopTime.current
                            }, data => console.log(data));
                        }}>
                            Stop
                        </Button>
                    </InputGroup>
                </div>
            </Container>
            <Container>
                <BootstrapTable
                    data={data}
                    bordered={false}
                    bodyStyle={{ overflow: 'overlay' }}
                    scrollTop={'Bottom'}
                    options={{ noDataText: 'No components yet, start the simulation!' }}
                    version='4'
                    hover
                    headerContainerClass='table-header'
                    className='table-container shadow-reg my-4'
                >
                    <THC isKey dataField='key' hidden></THC>
                    <THC dataField='component'
                        thStyle={header}
                        tdStyle={textSmall}
                        width='150'
                        dataSort
                    >
                        Component
                </THC>
                    <THC dataField='description'
                        thStyle={header}
                        tdStyle={text}
                    >
                        Description
                </THC>
                    <THC dataField='subscriptions'
                        thStyle={header}
                        tdStyle={text}
                        width='200'
                        dataSort
                    >
                        Subscriptions
                </THC>
                    <THC dataField='resource'
                        thStyle={header}
                        tdStyle={text}
                        width='100'
                    >
                        Resource
                </THC>
                    <THC dataField='type'
                        thStyle={header}
                        tdStyle={text}
                        width='110'
                        dataSort
                    >
                        Type
                </THC>
                    <THC dataField='status'
                        thStyle={header}
                        tdStyle={{ ...text, fontWeight: 400, color: simulationState === 'Ready' ? 'green' : simulationState === 'Running' ? 'blue' : 'red' }}
                        width='80'
                        dataSort
                    >
                        Status
                </THC>
                </BootstrapTable>
            </Container>
        </div >
    );
};

const header = { fontSize: 14, fontWeight: '400', color: '#787878' };
const text = { fontSize: 13, fontWeight: '300', color: '#787878' };
const textSmall = { fontSize: 12, fontWeight: '400', color: '#787878' };

export default Dashboard;