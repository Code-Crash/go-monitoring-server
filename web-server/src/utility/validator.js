

export const getCamelCaseKey = (string) => {
    return (string || '').charAt(0).toUpperCase() + string.slice(1);
}

export const TaskRequiredValidator = (task, key, options = {}) => {
    if (task && !task[key]) {
        return {
            invalid: true,
            helperText: `Please Enter ${getCamelCaseKey(key)}!`,
        };
    } else if (
        task &&
        task[key] &&
        task[key].length &&
        task[key].length < 5 &&
        options && options.min) {

        return {
            invalid: true,
            helperText: `${getCamelCaseKey(key)} must be more then 4 characters!`,
        };

    } else if (task &&
        task[key] &&
        task[key].length &&
        task[key].length >= 21 &&
        options && options.max) {
        return {
            invalid: true,
            helperText: `${getCamelCaseKey(key)} must be not be more then 20 characters!`,
        };
    } else if (!task) {
        return {
            invalid: true,
            helperText: `Task must not be black!`,
        };
    } else {
        return {
            invalid: false,
            helperText: ``,
        };
    }
}