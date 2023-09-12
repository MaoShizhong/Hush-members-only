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
exports.addNewPost = exports.getNewPostForm = exports.showPosts = void 0;
const Post_1 = require("../models/Post");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
// List of all posts - default homepage for secret club members
exports.showPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield Post_1.Post.find().populate('author').sort({ timestamp: -1 }).exec();
    res.render('posts', { posts: posts });
}));
const getNewPostForm = (req, res) => {
    res.render('new_post');
};
exports.getNewPostForm = getNewPostForm;
exports.addNewPost = [
    (0, express_validator_1.body)('title', 'Title cannot be empty').trim().notEmpty().escape(),
    (0, express_validator_1.body)('text', 'Message body cannot be empty').trim().notEmpty().escape(),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render('new_post', {
                errors: errors.array(),
            });
        }
        const post = new Post_1.Post({
            author: req.user._id,
            title: req.body.title,
            timestamp: new Date(),
            text: req.body.text,
        });
        yield post.save();
        res.redirect('/posts');
    })),
];
