const {HeaderName, StoreName} = require('../../../common/auth');

const getUser = (string) => {
    return Buffer.from(string, 'base64').toString().split(':')
};

const userMiddleware = (request, _, next) => {

    let user = {};

    try {

        const userAuth = request.cookies[StoreName.Authorization] || request.header(HeaderName.Authorization);

        if (userAuth) {

            const [accountId, token] = getUser(userAuth);

            user = {
                accountId,
                token
            };
        }


    } catch (ignore) {
        console.info('No valid user on request');
    }

    request.user = {
        hasCurrentUser: () => !!Object.keys(user).length,
        getCurrentUser: () => user,
    };

    next();
};

module.exports = {
    userMiddleware
};
