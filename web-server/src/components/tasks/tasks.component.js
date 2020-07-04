import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { MTableToolbar } from 'material-table';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Refresh from '@material-ui/icons/Refresh';
import { COLUMNS } from '../../utility/constants';
import TaskInstance from '../../services/task.service';

export default class TasksComponent extends Component {

    constructor(props) {
        super(props)

        this.service = TaskInstance();
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            isLoading: false,
            columns: COLUMNS,
            data: [],
            total: 0
        }
    }

    componentDidMount() {
        this.getAllCronEntries();
    }

    onRefresh() {
        this.getAllCronEntries();
    }

    getAllCronEntries() {
        const self = this;
        self.setState({
            isLoading: true
        }, () => {
            self.service.getAllCronEntries().then((result) => {
                self.setState({
                    isLoading: false,
                    data: result.data,
                    total: result.total
                })
            }).catch((error) => {
                console.error('InTaskComponent:', error);
                self.setState({
                    isLoading: false,
                })
            });
        });
    }

    render() {

        return (
            <MaterialTable
                title="Tasks List"
                columns={this.state.columns}
                data={this.state.data}
                options={{ search: true }}
                components={{
                    Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            <IconButton onClick={this.onRefresh} style={{ float: 'right' }}><Refresh /></IconButton>
                        </div>
                    ),
                }}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit Task Entry',
                        onClick: (event, rowData) => alert('Implimentation is Remianing for Edit Action' + rowData.name)
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete User',
                        onClick: (event, rowData) => window.confirm('Implimentation is Rmaining for Delete Action' + rowData.name)
                    }
                ]}
            />
        );
    }
}