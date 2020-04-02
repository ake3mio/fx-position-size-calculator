const SubscriptionManager = require('./subscription-manager');
const {getInstrumentsForAccountId} = require('./subscription-manager');
const {poll} = require('../core/timer');
const {instrument} = require('../core/forex-provider');
const config = require('../config');

const instrumentParams = (accountId) => {

    const instrumentsForAccountId = getInstrumentsForAccountId(accountId);

    if (instrumentsForAccountId.length) {
        return {
            instruments: encodeURIComponent(instrumentsForAccountId.join())
        };
    }

    return null;
};

const notifySockets = (sockets, payload) => {
    for (const [_, clients] of sockets) {
        clients.forEach(client => client.send(JSON.stringify(payload)));
    }
};

const instrumentRequest = (accountId, token, sockets) => {

    return new Promise((resolve, reject) => {

        const queryParams = instrumentParams(accountId);

        if (!queryParams) {
            return resolve()
        }

        instrument(token).get(accountId, queryParams, ({body}) => {

            const {time, prices, errorMessage} = body;

            if (errorMessage) {

                console.error(errorMessage);

                return reject();
            }

            notifySockets(sockets, {prices, time});
            resolve();
        });
    });
};

const processInstrumentRequests = (clients) => {
    const promises = [];
    for (const [accountId, {sockets, token}] of clients) {
        promises.push(instrumentRequest(accountId, token, sockets));
    }
    return Promise.all(promises);
};

const sender = async function (getClients) {

    poll(() => {

        return new Promise((resolve, reject) => {

            try {

                if (!Object.keys(SubscriptionManager.getRecords()).length) {
                    return resolve();
                }

                return processInstrumentRequests(getClients()).then(resolve);

            } catch (error) {
                reject(error);
            }
        });

    }, config.prices.updateInterval);

};
module.exports = {sender};


