exports.protectedRouteMiddleware = (req, res, next) => {

    if (req.user.hasCurrentUser()) {
        return next();
    }

    res.status(401).json({errorMessage: 'UNAUTHORIZED_USER'});
};
