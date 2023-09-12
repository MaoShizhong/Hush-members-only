"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinSecretClub = exports.logout = exports.attemptLogin = exports.getLoginPage = exports.registerAccount = exports.getSignupPage = exports.getHomepage = void 0;
const User_1 = require("../models/User");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
// Show different homepage if logged in or not
const getHomepage = (req, res) => {
    if (req.user && req.user.isMember)
        res.redirect('/posts');
    res.render('home', {
        failedJoin: req.query.join === 'false',
    });
};
exports.getHomepage = getHomepage;
const getSignupPage = (req, res) => {
    res.render('signup');
};
exports.getSignupPage = getSignupPage;
exports.registerAccount = [
    (0, express_validator_1.body)('username', 'Username must be a minimum of 4 characters')
        .trim()
        .isLength({ min: 4 })
        .escape()
        .custom((username) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield User_1.User.findOne({ username: username }).exec();
        if (existingUser)
            throw new Error('Username already in use');
    })),
    (0, express_validator_1.body)('firstname', 'First name cannot be empty').trim().notEmpty().escape(),
    (0, express_validator_1.body)('lastname').trim().escape(),
    (0, express_validator_1.body)('password', 'Password must be at least 8 characters long and contain at least 1 letter and one number')
        .trim()
        .custom((password) => {
        // Repeat password pattern validatioin on server side
        return /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/.test(password);
    }),
    (0, express_validator_1.body)('confirm-password', 'Passwords do not match')
        .trim()
        .custom((password, { req }) => password === req.body.password),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('errors');
            return res.render('signup', {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                errors: errors.array(),
            });
        }
        // Only hash and create new User if successful account registration
        bcrypt_1.default.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = new User_1.User({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname || undefined,
                    password: hashedPassword,
                    isMember: false,
                });
                yield user.save();
                req.login(user, (err) => {
                    if (err)
                        return next(err);
                    res.redirect('/');
                });
            }
            catch (err) {
                return next(err);
            }
        }));
    })),
];
// Get login form
const getLoginPage = (req, res) => {
    res.render('login');
};
exports.getLoginPage = getLoginPage;
// Login attempt
exports.attemptLogin = passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
});
// Logout
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err)
            next(err);
        else
            res.redirect('/');
    });
};
exports.logout = logout;
// Secret club join attempt
exports.joinSecretClub = [
    (0, express_validator_1.body)('secret', 'You are too loud to join us. Access denied.').trim().isEmpty(),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.redirect('/?join=false');
        }
        yield User_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, { isMember: true });
        res.redirect('/messages');
    })),
];
