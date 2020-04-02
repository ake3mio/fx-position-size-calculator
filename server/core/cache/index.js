const {ONE_HOUR_IN_SECONDS} = require('../timer/constants');
const LRU = require('lru-cache');

const options = {
    max: 500,
    dispose: function (key, n) {
        if (n.close) {
            n.close()
        }
    },
    maxAge: ONE_HOUR_IN_SECONDS
};

const cache = new LRU(options);

const cacheJsonResponse = (getKey, maxAgeMs, onCondition = (req, body) => true, shouldEvict) => {
    return (req, res, next) => {

        const key = getKey ? getKey(req) : req.originalUrl || req.url;
        const cacheKey = `__cache__${key}`;


        let cachedBody = cache.get(cacheKey);

        if (cache.get(cacheKey) && shouldEvict && shouldEvict(req, cachedBody)) {
            cachedBody = null;
            cache.del(cacheKey);
        }

        if (cachedBody) {

            return res.json(cachedBody);
        } else {

            res.sendResponse = res.json;

            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode <= 299 && onCondition(req, body)) {
                    cache.set(cacheKey, body, maxAgeMs);
                }
                res.sendResponse(body);
                res.sendResponse = undefined;
            };

            next();
        }
    }
};


module.exports = {cacheJsonResponse};
