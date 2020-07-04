
/**
 * @description This function will help you to control your debug/crash logs at one place
 * @param {*} message 
 * @param {*} type 
 * @param {*} element 
 */
export const logger = (message, type, options) => {
    if (type && type === 'error') {
        console.error(message);
    } else {
        console.log(message);
    }
}