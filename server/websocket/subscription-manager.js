const {EventType} = require('../../common/websockets');

const records = {};

const receiver = function ({accountId}, {type, payload}) {

    if (Array.isArray(payload)) {
        switch (type) {
            case EventType.ADD_INSTRUMENTS: {
                for (let i = 0; i < payload.length; i++) {
                    const instrument = payload[i];
                    if (!records[instrument]) {
                        records[instrument] = new Set()
                    }

                    records[instrument].add(accountId);
                }
                break;
            }
            case EventType.REMOVE_INSTRUMENTS: {
                for (let i = 0; i < payload.length; i++) {
                    const instrument = payload[i];
                    removeFromInstrument(accountId, instrument)
                }
                break;
            }
            default:
                console.info('Falling though subscription manager receiver');

        }
    }
};

const removeFromRecord = ({accountId}) => {
    for (let i in records) {
        removeFromInstrument(accountId, i);
    }
};

const removeFromInstrument = (accountId, instrument) => {

    if (records[instrument] && records[instrument].has(accountId)) {
        records[instrument].delete(accountId);
    }

    if (!records[instrument] || records[instrument].size === 0) {
        delete records[instrument];
    }
};

const getRecords = () => records;

const getInstrumentsForAccountId = (accountId) => {

    const instruments = new Set();

    for (const instrument in records) {
        const record = records[instrument];
        if (record.has(accountId)) {
            instruments.add(instrument);
        }
    }

    return [...instruments];
};

module.exports = {receiver, removeFromRecord, getRecords, getInstrumentsForAccountId};
