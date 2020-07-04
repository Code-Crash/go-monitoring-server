

/**
 * @description This are the default messages which will shown to user for his/her motivation of fun
 */
const MESSAGES = [
    "Don't forgot to take the notes?",
    "Did you miss any task to add?",
    "Did you check the status of the task?",
    "Congrats as everything looks great",
    "Hope you enjoyed the monitoring!",
    "Damn it!",
    "Oops, it looks like something is not right!",
    "Did you applied analytics on the task entries?",
]

/**
 * @description This function will return any random string from messages
 */
export const getMessage = () => {
    let min = 0;
    let max = MESSAGES.length - 1;
    let random = Math.ceil(Math.random() * (+max - +min) + +min);
    console.log(random, MESSAGES);
    return MESSAGES[random];
}
