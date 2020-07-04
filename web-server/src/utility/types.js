import ReactDOM from "react-dom";

/**
 * @description This function will validate the value is function or not
 * @param {*} _function_ 
 */
export const isFunction = (_function_) => {
    return (_function_ && _function_.constructor === Function) ? true : false;
}

/**
 * @description This functions will return if the given element is html element or not
 * @param {*} element 
 */
export const isHtmlElement = (element) => {
    return (element && element instanceof HTMLElement) ? true : false;
}

/**
 * @description This function will find the html element and if found, return the same or false
 * @param {*} element 
 */
export const getHTMLElement = (element) => {
    if (element) {
        element = ReactDOM.findDOMNode(element);
        if (element instanceof HTMLElement) {
            return element
        } else {
            return false;
        }
    } else {
        return false;
    }
}