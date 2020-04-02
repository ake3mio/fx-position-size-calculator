const composeMiddleware = middleware =>
    (request = {}, response = {}, callback) => {
        return middleware.reduceRight((lastMiddleware, middleware) =>
                (next) => middleware(request, response, () => lastMiddleware(request, response, next)), callback)();
    };

module.exports = {
    composeMiddleware
};
