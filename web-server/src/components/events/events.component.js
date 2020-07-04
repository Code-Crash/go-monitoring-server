import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { MTableToolbar } from 'material-table';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Refresh from '@material-ui/icons/Refresh';
import { COLUMNS } from '../../utility/constants';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Card from '@material-ui/core/Card';
import { getCamelCaseKey } from '../../utility/validator';
import emitter from '../../utility/emitter';
import './events.component.css';

export default class EventsComponent extends Component {

    constructor(props) {
        super(props)
        this.mounted = false;
        this.state = {
            events: [],
        };

        this.onEntryEvent = this.onEntryEvent.bind(this);
    }

    componentDidMount() {
        const self = this;
        self.mounted = true;
        if (emitter && emitter.on) {
            emitter.on('onEntry', (data) => {
                if (self.mounted) {
                    self.onEntryEvent(data);
                }
            });
        }
    }

    componentWillUnmount() {
        // Register the Event Listener
        this.mounted = false;
    }

    onEntryEvent = (data) => {
        this.setState({
            events: [...this.state.events, data]
        });
        console.log('onEntryEvent:', data);
    }

    render() {
        const events = this.state.events;
        return (
            <div className={"event-container"}>
                {
                    (events || []).map((item, index) => {
                        return (
                            <Alert variant={'outlined'} key={index} severity={item.type || 'warning'} className={"event"}>
                                <AlertTitle >{getCamelCaseKey(item.type)}</AlertTitle>
                                {item.message || ''}<br />
                                <em>
                                    <code>
                                        {
                                            JSON.stringify(item.data || '{}', null, 2)
                                        }
                                    </code>
                                </em>
                            </Alert>
                        );
                    })
                }
            </div>
        );
    }
}