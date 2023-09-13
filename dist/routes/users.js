"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const posts_1 = require("./posts");
const userController = __importStar(require("../controllers/user_controller"));
exports.usersRouter = (0, express_1.Router)();
const isSameUser = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.username) !== req.params.username) {
        res.redirect('/?volume=403dBA&too_loud=go_away');
    }
    else {
        next();
    }
};
/* GET user profile */
exports.usersRouter.get('/:username', posts_1.isLoggedIn, userController.showProfile);
/* GET delete account confirm */
exports.usersRouter.get('/:username/delete', posts_1.isLoggedIn, isSameUser, userController.confirmDeleteAccount);
/* POST delete account */
exports.usersRouter.post('/:username/delete', posts_1.isLoggedIn, isSameUser, userController.deleteAccount);
