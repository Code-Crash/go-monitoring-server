import axios from './axios';
import { logger } from '../utility/logger'

export default class BaseService {

    constructor() {
        logger('Base Service Initialize!');
    }

    async GetList(options) {
        try {
            return axios.get(options.path, { crossdomain: true }).then((result) => {
                return result;
            }).catch((detail) => {
                if (detail && detail.data && detail.data.errors) {
                    throw detail.data;
                } else if (detail && detail.data && detail.data.result) {
                    return detail.data.result;
                } else {
                    throw detail;
                }
            });
        } catch (error) {
            logger(error, 'error')
            throw error.response;
        }
    }

}