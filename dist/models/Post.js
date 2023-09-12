"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, required: true },
    text: { type: [String], required: true },
});
PostSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});
exports.Post = (0, mongoose_1.model)('post', PostSchema);
