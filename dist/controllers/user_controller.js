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
exports.deleteAccount = exports.confirmDeleteAccount = exports.showProfile = void 0;
const User_1 = require("../models/User");
const Post_1 = require("../models/Post");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// Show profile
exports.showProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.params.username }).exec();
    if (!user)
        res.redirect('/?too_loud=go_away');
    res.render('profile', {
        user: user,
    });
}));
// Confirm account delete
const confirmDeleteAccount = (req, res) => res.render('delete_account');
exports.confirmDeleteAccount = confirmDeleteAccount;
// Actually delete account
exports.deleteAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userToBeDeleted = yield User_1.User.findOne({ username: req.params.username }).exec();
    yield Promise.all([
        Post_1.Post.deleteMany({ author: userToBeDeleted === null || userToBeDeleted === void 0 ? void 0 : userToBeDeleted._id }).exec(),
        User_1.User.deleteOne({ username: req.params.username }).exec(),
    ]);
    req.logout((err) => {
        if (err)
            return next(err);
        res.redirect('/');
    });
}));
