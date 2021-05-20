const { userModel, tokenBlacklistModel } = require('../models');
const utils = require('../utils');
const { authCookieName } = require('../app-config');
const { jwt } = require('../utils');

const bsonToJson = (data) => {
    return JSON.parse(JSON.stringify(data));
};

const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData;
};

function register(req, res, next) {
    const { password, rePassword } = req.body;

    if (password !== rePassword) {
        res.status(409)
            .send({ message: 'Password don\'t match!' });
        return;
    }

    return userModel.create({ ...req.body })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            const token = jwt.createToken({ id: createdUser._id });

            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSit: 'none', secure: true });
            }
            else {
                res.cookie(authCookieName, token, { httpOnly: true });
            }

            res.status(200)
                .send(createdUser);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split('index: ')[1];
                field = field.split(' dup key')[0];
                field = field.substring(0, field.lastIndexOf('_'));

                res.status(409)
                    .send({ message: `This ${field} is already exist!` });
                return;
            }
            next(err);
        });
}

function login(req, res, next) {
    const { email, password } = req.body;

    userModel.findOne({ email })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        })
        .then(([user, match]) => {
            if (!match) {
                res.status(401)
                    .send({ message: 'Wrong email or password' });
                return;
            }

            user = bsonToJson(user);
            user = removePassword(user);

            const token = jwt.createToken({ id: user._id });

            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSit: 'none', secure: true });
            }
            else {
                res.cookie(authCookieName, token, { httpOnly: true });
            }

            res.status(200)
                .send(user);
        })
        .catch(next);
}

function logout(req, res, next) {
    const token = req.cookies[authCookieName];
    tokenBlacklistModel.create({ token })
        then(() => {
            res.clearCookie(authCookieName)
                .status(200)
                .send({ message: 'Logged out' });
        })
        .catch(err => res.send(err));
}

module.exports = {
    register,
    login,
    logout
}