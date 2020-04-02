const EventType = {
    ADD_INSTRUMENTS: 'ADD_INSTRUMENTS',
    REMOVE_INSTRUMENTS: 'REMOVE_INSTRUMENTS'
};

const ErrorCauses = {
    UNAUTHORIZED_USER: "UNAUTHORIZED_USER"
};

const ErrorCodes = {
    [ErrorCauses.UNAUTHORIZED_USER]: 4000
};

module.exports = {
    createError(errorCause) {
        return {
            code: ErrorCodes[errorCause],
            errorCause
        }
    },
    ErrorCauses,
    EventType
};

