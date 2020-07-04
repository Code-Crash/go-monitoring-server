import axios from 'axios';


export let BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(function (config) {

    // 1. Check BASE_URL present
    if (config.url.includes(BASE_URL) !== true) {
        console.log('axios: request', BASE_URL, false);
        config.url = BASE_URL + '/' + config.url;
    }
    if (!config.headers) {
        config.headers = {};
    }
    // if (!config.headers['session-token']) {
    //     config.headers['session-token'] = sessionToken;
    // }
    // 3. Add an identifier to trace the APIs origin.
    config.headers['server'] = 'WEB_APP';
    // config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Content-Type'] = 'application/json';
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response && response.data && response.data.status === 'success') {
        return response.data.result;
    } else {
        return Promise.reject(response);
    }
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
});
export default axiosInstance;