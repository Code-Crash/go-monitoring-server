import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
// import Close from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { TaskRequiredValidator } from '../../../utility/validator';
import TaskInstance from '../../../services/task.service';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height: '100%',
        width: '100%',
        overflowY: 'scroll',
    },
    addBtn: {
        border: '1px solid red',
        float: "right",
    },
    header: {
        margin: '10px 0px',
        display: 'flex',
        borderBottom: '1px solid #c4c4c4',
        // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    addTitle: {
        // fontSize: '102%',
        width: 'max-content',
        margin: 0,
        flexGrow: 1,
        height: '100%',
        padding: '10px 10px',
    },
    addTaskForm: {
        width: '100%',
    },
    taskInputProps: {
        width: '100%',
        margin: '10px 0px',
    },
    taskSmallInputProps: {
        width: '30%',
        margin: '10px 0px',
        flex: 1
    },
    childInputs: {
        display: 'flex'
    },
    addActionContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse'
    }
}));

export default function AddTaskModalComponent(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                className={""}
                startIcon={<Add />}
                onClick={handleOpen}
            >
                Add Task
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <AddTaskModalHeader handleClose={handleClose} />
                        <AddTaskModalContent {...props} classes={classes} handleClose={handleClose} />
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}


const TaskModal = {
    "id": "",
    "name": "", // Required
    "description": "",
    "host": "", // Required
    "port": "", // Required
    "method": "", // Required
    "path": "",
    "headers": "",
    "protocol": "",
    "body": "",
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AddTaskModalContent extends Component {
    constructor(props) {
        super(props)

        this.service = TaskInstance();
        const validators = {};
        Object.keys(TaskModal || {}).forEach((key) => {
            validators[key] = {
                invalid: false,
                helperText: '',
            }
        });

        this.state = {
            task: TaskModal,
            validator: validators,
            isLoading: false,
            isDisabled: false,
            isDialogOpen: false,
            error: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.validator = this.validator.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onDialogToggle = this.onDialogToggle.bind(this);
    }

    onDialogToggle = () => {
        if (this.state.isDialogOpen) {
            this.setState({
                isDialogOpen: false,
                error: ''
            });
        } else {
            this.setState({
                // isDialogOpen: !this.state.isDialogOpen
                isDialogOpen: true
            });
        }
    };

    isValidationEnabled(name = '') {
        let keys = ['name', 'host', 'port', 'method'];
        return (keys.indexOf(name) > -1) ? true : false;
    }

    onChange(event) {
        const self = this;
        let valid = null

        if (event &&
            event.target &&
            event.target.name &&
            self.isValidationEnabled(event.target.name)) {
            let options = {};
            if (event.target.name === 'name') {
                options = { min: true, max: true };
            }
            valid = {
                ...self.state.validator,
                [event.target.name]: TaskRequiredValidator(self.state.task, event.target.name, options)
            };
        }
        if (valid) {
            self.setState({
                task: {
                    ...self.state.task,
                    [event.target.name]: event.target.value
                },
                validator: valid
            });
        } else {
            self.setState({
                task: {
                    ...self.state.task,
                    [event.target.name]: event.target.value
                }
            });
        }
    }

    validator() {
        const self = this;
        let valid = true;
        let validators = this.state.validator;

        let name = TaskRequiredValidator(self.state.task, 'name', { min: true, max: true });
        let host = TaskRequiredValidator(self.state.task, 'host');
        let port = TaskRequiredValidator(self.state.task, 'port');
        let method = TaskRequiredValidator(self.state.task, 'method');

        if (name.invalid) {
            valid = false;
            validators = { ...validators, 'name': name };
        }

        if (host.invalid) {
            valid = false;
            validators = { ...validators, 'host': host };
        }

        if (port.invalid) {
            valid = false;
            validators = { ...validators, 'port': port };
        }

        if (method.invalid) {
            valid = false;
            validators = { ...validators, 'method': method };
        }

        if (valid) {
            return true;
        } else {
            this.setState({
                validator: validators
            });
            return false;
        }
    }

    onBlur() {
        if (this.validator()) {
            console.log('valid');
        } else {
            console.log('not valid');
        }
    }

    onSave() {
        // TODO: Required Validator is done, Data Validator is pending
        const self = this;
        if (this.validator()) {
            this.setState({
                isLoading: true,
                isDisabled: true,
                onTaskOnceAdded: true,
            }, () => {
                self.service.addTask(self.state.task).then((result) => {
                    this.setState({
                        isLoading: false,
                        isDisabled: false,
                        task: TaskModal,
                        isDialogOpen: true,
                        onTaskOnceAdded: true,
                        error: ('Your task is added and scheduled to run in every 1 minutes, Please close and refresh Task Entries or continue to create new Tasks!') // TODO: Parser is remaining for array|object type
                    });

                }).catch((error) => {
                    self.setState({
                        isLoading: false,
                        isDisabled: false,
                        isDialogOpen: true,
                        error: (error && error.errors ? error.errors : '') // TODO: Parser is remaining for array|object type
                    })
                });
            });
            console.log('data is valid!', self.state.task);
        } else {
            console.error('onSave failed', self.state.task);
        }
    }

    onDialogClose() {
        const self = this;
        if (self.props && self.props.handleClose &&
            self.props.handleClose.constructor === Function) {
            self.props.handleClose();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <form className={classes.addTaskForm} autoComplete={"off"}>
                    <div className={classes.addActionContainer}>
                        {
                            this.state.isLoading ?
                                <CircularProgress /> :
                                <IconButton onClick={this.onSave} color="primary" aria-label="Close Add Task Modal">
                                    <Add />
                                </IconButton>
                        }
                    </div>
                    <TextField
                        error={this.state.validator['name']['invalid']}
                        name="name"
                        label="Task Name"
                        defaultValue={this.state.task.name}
                        helperText={this.state.validator['name']['helperText']}
                        variant="outlined"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        required
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-name",
                            id: "task-name",
                        }}
                    />
                    <TextField
                        error={this.state.validator['description']['invalid']}
                        name="description"
                        label="Task Description"
                        defaultValue={this.state.task.description}
                        helperText={this.state.validator['description']['helperText']}
                        variant="outlined"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-description",
                            id: "task-description",
                        }}
                    />
                    <TextField
                        error={this.state.validator['host']['invalid']}
                        name="host"
                        label="Task Request Host"
                        defaultValue={this.state.task.host}
                        helperText={this.state.validator['host']['helperText']}
                        variant="outlined"
                        required
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-host",
                            id: "task-host",
                        }}
                    />
                    <div className={classes.childInputs}>
                        <TextField
                            error={this.state.validator['port']['invalid']}
                            name="port"
                            label="Task Request Port"
                            defaultValue={this.state.task.port}
                            helperText={this.state.validator['port']['helperText']}
                            variant="outlined"
                            required
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            disabled={this.state.isDisabled}
                            className={classes.taskSmallInputProps}
                            InputProps={{
                                className: "task-port",
                                id: "task-port",
                            }}
                        />
                        <TextField
                            error={this.state.validator['method']['invalid']}
                            name="method"
                            label="Task Request Method"
                            defaultValue={this.state.task.method}
                            helperText={this.state.validator['method']['helperText']}
                            variant="outlined"
                            required
                            style={{ margin: '10px' }}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            disabled={this.state.isDisabled}
                            className={classes.taskSmallInputProps}
                            InputProps={{
                                className: "task-method",
                                id: "task-method",
                            }}
                        />
                        <TextField
                            error={this.state.validator['path']['invalid']}
                            name="path"
                            label="Task Request Path"
                            defaultValue={this.state.task.path}
                            helperText={this.state.validator['path']['helperText']}
                            variant="outlined"
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            disabled={this.state.isDisabled}
                            className={classes.taskSmallInputProps}
                            InputProps={{
                                className: "task-path",
                                id: "task-path",
                            }}
                        />
                    </div>
                    <TextField
                        error={this.state.validator['headers']['invalid']}
                        name="headers"
                        label="Task Request Headers"
                        defaultValue={this.state.task.headers}
                        helperText={this.state.validator['headers']['helperText']}
                        variant="outlined"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-headers",
                            id: "task-headers",
                        }}
                    />
                    <TextField
                        error={this.state.validator['protocol']['invalid']}
                        name="protocol"
                        label="Task Request Protocol"
                        defaultValue={this.state.task.protocol}
                        helperText={this.state.validator['protocol']['helperText']}
                        variant="outlined"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-protocol",
                            id: "task-protocol",
                        }}
                    />
                    <TextField
                        error={this.state.validator['body']['invalid']}
                        name="body"
                        label="Task Request Body"
                        defaultValue={this.state.task.body}
                        helperText={this.state.validator['body']['helperText']}
                        variant="outlined"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={this.state.isDisabled}
                        className={classes.taskInputProps}
                        InputProps={{
                            className: "task-body",
                            id: "task-body",
                        }}
                    />
                </form>

                <Dialog
                    open={this.state.isDialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.onDialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Error While Adding New Task"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.state.error ? JSON.stringify(this.state.error) : 'Oops, something bad happens, Reload and try again!'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onDialogToggle} color="primary">
                            Okay
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }

};

/**
 * @description This is a Model HTML for Add Task Modal
 * @param {*} props 
 */
function AddTaskModalHeader(props) {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.header} >
                <h2 id="transition-modal-title" className={classes.addTitle}>
                    Add Task
                </h2>

                <IconButton
                    onClick={props.handleClose}
                    color="primary"
                    aria-label="Close Add Task Modal"
                >
                    <Close />
                </IconButton>
            </div>
        </div>
    );
};