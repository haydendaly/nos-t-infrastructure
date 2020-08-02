import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
const theme = require('../../styles/jsonpretty.css');

class JSONCell extends Component {

    constructor(props) {
        super(props);
        let data = Object.assign({}, props.cell);
        delete data.key;
        this.state = {
            data,
            keys: props.keys,
            open: this.props.keys.includes(this.props.cell.key)
        }
    }

    componentDidMount() {
        this.setState({ 
            keys: this.props.keys,
            open: this.props.keys.includes(this.props.cell.key)
        });
    }

    shouldComponentUpdate(nextProps){
        return (
            this.props || this.props.keys.includes(key) !== nextProps.keys.includes(key)
        );
    }

    render() {

        return (
            <div
                onClick={() => {
                    const keys = this.state.keys;
                    const key = this.props.cell.key;
                    let tempKeys;

                    if (keys.includes(key)) {
                        tempKeys = keys.filter(o => o !== key);
                    } else {
                        tempKeys = keys;
                        tempKeys.push(key);
                    }
                    if (keys !== tempKeys) {
                        this.setState({
                            keys: tempKeys,
                            open: !this.state.open,
                        });
                        this.props.setKeys(tempKeys);
                    }
                }}
            >
                {
                    this.state.open ? (
                        <JSONPretty data={this.state.data} theme={theme}></JSONPretty>
                    ) : (
                        <span className='table-row-text-small'>{JSON.stringify(this.state.data, null, 2)}</span>
                    )
                }
            </div>
        );
    }
};

export default JSONCell;