import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import TasksComponent from '../tasks/tasks.component'
import EventsComponent from '../events/events.component'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

export default class CenteredTabsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.setState({
            value: (this.state.value === 0 ? 1 : 0),
        });
    };

    render() {
        const { value } = this.state;
        return (
            <Container className={'root'} >
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="fullWidth"
                >
                    <Tab label="Tasks" />
                    <Tab label="Real Time Events" />
                </Tabs>
                <TabPanel value={value} index={0} dir={'ltr'}>
                    <TasksComponent />
                </TabPanel>
                <TabPanel value={value} index={1} dir={'ltr'}>
                    <EventsComponent />
                </TabPanel>
            </Container >
        );
    }
}