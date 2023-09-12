"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, min: 4, max: 20, required: true },
    firstname: { type: String, required: true },
    lastname: String,
    password: { type: String, required: true },
    isMember: { type: Boolean, required: true },
});
UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
});
exports.User = (0, mongoose_1.model)('user', UserSchema);
