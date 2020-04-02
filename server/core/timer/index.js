const poll = (promiseFactory, interval) => {
    let ref;
    const execute = () => promiseFactory().finally(waitAndExecute);
    const waitAndExecute = () => {
        ref = setTimeout(execute, interval);
    };
    execute();

    return {
        cancel: () => clearTimeout(ref)
    }
};

module.exports = {
    poll,
};
