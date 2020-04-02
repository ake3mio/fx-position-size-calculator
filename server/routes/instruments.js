const express = require('express');
const {InstrumentSeparator} = require('../../common/forex');
const {protectedRouteMiddleware} = require('../core/server/auth');
const {ONE_DAY_IN_MS} = require('../core/timer/constants');
const {cacheJsonResponse} = require('../core/cache');

const router = express.Router();

router.use(protectedRouteMiddleware);

const {account, instrument, validator} = require('../core/forex-provider');

const listCache = cacheJsonResponse(
    (req) => `/instruments?${req.user.getCurrentUser().accountId}`,
    ONE_DAY_IN_MS
);

router.get('/', listCache, function (req, res) {


    const {accountId, token} = req.user.getCurrentUser();

    return account(token).instruments(accountId, undefined, ({body}) => {

        const toNameAndDisplayName = ({name}) => ({name, displayName: name.replace(InstrumentSeparator, '/')});

        const result = body.instruments
            .map(toNameAndDisplayName)
            .filter(validator().isSupportedInstrument);

        res.json(result);
    });
});

const getCacheKey = (req) => `/instruments?${req.user.getCurrentUser().accountId}&${JSON.stringify(req.body)}`;
const itemCache = cacheJsonResponse(
    getCacheKey,
    5000,
    (req, body) => {
        return !!Object.keys(body).length;
    }
);

router.post('/', itemCache, function (req, res) {

    const {accountId, token} = req.user.getCurrentUser();

    const instruments = [...new Set(req.body.instruments)];

    if (!instruments.length) {
        return res.json({});
    }

    const params = {
        instruments: encodeURIComponent(instruments.join())
    };

    instrument(token).get(accountId, params, ({body}) => {

        const {time, prices, errorMessage} = body;

        if (errorMessage) {

            console.error(errorMessage);

            return res.status(400).json({errorMessage});
        }

        res.json({time, prices});
    });
});

module.exports = router;
