import React from 'react';
import { Container } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn as THC } from 'react-bootstrap-table';
import '../styles/style.scss';

function Dashboard({ components }) {

    let data = components.map(component => {
        return {
            key: component.key,
            component: component.name,
            description: component.description,
            subscriptions: component.topic,
            resource: component.resources ? 'Here' : 'None',
            type: component.topic,
            status: 'Ready'
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
                options={{ noDataText: 'No components yet, start the simulation!' }}
                version='4'
                hover
                headerContainerClass='log-table-header'
                className='table-container shadow-reg my-4'
            >
                <THC isKey dataField='key' hidden></THC>
                <THC dataField='component' style={headerColumn} thStyle={header} trStyle={row} tdStyle={{ ...text, fontWeight: 13, fontWeight: '400' }} width='120' dataSort>Component</THC>
                <THC dataField='description' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='320'>Description</THC>
                <THC dataField='subscriptions' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='160'>Subscriptions</THC>
                <THC dataField='resource' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='160'>Resource</THC>
                <THC dataField='type' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='160'>Type</THC>
                <THC dataField='status' style={headerColumn} thStyle={header} trStyle={row} tdStyle={text} width='160'>Status</THC>
            </BootstrapTable>
        </Container>
    );
};

const headerColumn = { padding: 100 };
const header = { fontSize: 15, fontWeight: '400', color: '#787878' };
const row = { margin: 5, backgroundColor: 'red' };
const text = { fontSize: 14, fontWeight: '300', color: '#787878' };

export default Dashboard;