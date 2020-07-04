import React, { Component } from 'react';
import './home.component.css';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Refresh from '@material-ui/icons/Refresh';
import { getMessage } from '../../utility/messages';
import CenteredTabsComponent from '../tabs/tabs.component.js';
import AddTaskModalComponent from '../modals/add-task/add-task.component';
class HomeComponent extends Component {

    constructor(props) {
        super(props);
        this.onJoinRoom = this.onJoinRoom.bind(this);
        this.onChange = this.onChange.bind(this);
        this.validator = this.validator.bind(this);
        this.onLeaveCall = this.onLeaveCall.bind(this);
        this.state = {
            room: '',
            user: 'CodeCrash',
            input: {
                invalid: false,
                helperText: 'Pleas Enter Room Name to Start or Join the Gossips!',
            },
            startSession: false,
        }
    }

    validator() {
        if (!this.state.room) {
            return {
                invalid: true,
                helperText: 'Please Enter Room Name!',
            };
        } else if (this.state.room && this.state.room.length && this.state.room.length < 5) {
            return {
                invalid: true,
                helperText: 'Room name must be more then 4 characters!',
            };
        } else if (this.state.room && this.state.room.length && this.state.room.length >= 21) {
            return {
                invalid: true,
                helperText: 'Room name must not be more then 20 characters!',
            };
        } else if (this.state.room && this.state.room.length && (!this.state.room.length >= 21) && (!this.state.room.length <= 5)) {
            return {
                invalid: true,
                helperText: 'Your room name is valid!',
            };
        } else {
            return {
                invalid: false,
                helperText: 'Pleas enter room name to Start or Join the Gossips!',
            };
        }
    }

    onLeaveCall() {
        this.setState({
            startSession: false
        }, () => {
            setTimeout(() => {
                let message = getMessage();
                console.log(message)
                alert(message)
            }, 1000);
        })
    }

    onJoinRoom() {
        let valid = this.validator()
        this.setState({
            input: valid
        }, () => {
            if (!valid.invalid) {
                this.setState({
                    startSession: true
                }, () => {
                    this.onLeaveCall();
                })

            }
        });
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
            this.setState({
                input: this.validator()
            })
        });

        event.preventDefault();
    }

    render() {
        // const { helperText, invalid } = this.state.input;
        return (
            <div className={"home-container"}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={"logo-title"}>
                            Monitoring Server
                        </Typography>

                        {/* 
                        <IconButton className={"add-button"} color="inherit" aria-label="menu">
                            <Refresh />
                        </IconButton>
                         */}
                        <AddTaskModalComponent />
                    </Toolbar>
                </AppBar>
                {/* <Card className={"home-card-container"}> */}
                {/* <CardContent> */}
                <CenteredTabsComponent />
                {/* </CardContent> */}
                {/* <CardActions>
                            <div className="action-container">
                                <Button size="small" color="primary"
                                    className={"btn-invite"} disabled
                                    variant="outlined">

                                    Invite
                                </Button>
                                <Button onClick={this.onJoinRoom} disabled={this.state.input.invalid} variant="outlined" size="small" color="primary" className={"btn-join"}>
                                    Join
                                </Button>
                            </div>
                        </CardActions> */}
                {/* </Card> */}
            </div>
        );
    }

}

export default HomeComponent;

