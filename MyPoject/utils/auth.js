const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const { userModel, tokenBlacklistModel } = require('../models');

function auth(unauthenticated = true) {
    return function (req, res, next) {
        const token = req.cookies[authCookieName] || '';
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token }),
        ])
            .then(([date, blackListToken]) => {
                if (blackListToken) {
                    return Promise.reject(new Error('blacklistedtoken'));
                }
                userModel.findById(data.id)
                    .then(user => {
                        req.user = user;
                        req.isLogged = true;
                        next();
                    })
            })
            .catch(err => {
                if (!unauthenticated) {
                    next();
                    return;
                }

                if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                    console.error(err);
                    res.send(401).send({ message: 'Invalid token' });
                    return;
                }
                next(err);
            })
    }
}

module.exports = auth;