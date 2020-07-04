/**
 * @description This file contains the utilities 
 */
import axios from './axios';
import { BASE_URL } from './axios';
import BaseService from './base.service';
import { logger } from '../utility/logger';
import { GetAllEntryServerToClient, EntryServerToClient } from '../utility/serializers';

export class TaskService extends BaseService {

    constructor() {
        super();
        logger('Task Service is Initialized');
        this.BASE_URL = BASE_URL;
    }

    /**
     * @description This service is  
     */
    async getAllCronEntries() {
        try {
            let result = await this.GetList({ path: 'api/v1/entries' }, { crossdomain: true });
            result.data = GetAllEntryServerToClient(result.data);
            return result;
        } catch (error) {
            logger(error, 'error');
            throw error;
        }
    }

    async addTask(task) {
        try {
            // Clean object for blank on the
            let _task = {};
            Object.keys((task || {})).forEach((key) => {
                if (task[key] || // If the value is valid (not in [0, false, null, '',])
                    (typeof task[key] == Number) || // Number bypass
                    (typeof task[key] == String && task[key].length > 0) || // Boolean string with length more 0 bypass
                    (typeof task[key] == Boolean) // Boolean bypass
                ) {
                    _task[key] = task[key];
                }
            });

            return new Promise((resolve, reject) => {
                return axios.post('api/v1/task', _task, { crossdomain: true }).then((response) => {
                    resolve(response);
                }).catch((response) => {
                    if (response && response.data && response.data.errors) {
                        reject(response.data);
                    } else if (response && response.data && response.data.result) {
                        resolve(response.data.result);
                    } else {
                        reject(response);
                    }
                });
            });
        } catch (error) {
            logger(error, 'error');
            throw error;
        }
    }
}

let instance = null; // Global Instance for singleton task service
function TaskInstance() {
    try {
        if (instance) {
            return instance;
        } else {
            instance = new TaskService();
            return instance;
        }
    } catch (error) {
        console.log(error);
    }
}

export default TaskInstance;





