const {SupportedInstruments} = require('../../../common/forex');
const {EntitySpec: Account} = require('@oanda/v20/account');
const {EntitySpec: Instrument} = require('@oanda/v20/pricing');
const {request} = require('./context');

class Validator {

    isSupportedInstrument = ({name}) => {
        return SupportedInstruments.includes(name);
    }
}

module.exports = {
    account: (token) => new Account({request: request(token)}),
    instrument: (token) => new Instrument({request: request(token)}),
    validator: (_) => new Validator()
};
