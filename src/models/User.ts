import { Schema, Types, model } from 'mongoose';

type UserModel = {
    _id: Types.ObjectId;
    username: string;
    firstname: string;
    lastname?: string;
    password: string;
    isMember: boolean;
    url: string;
};

const UserSchema = new Schema<UserModel>({
    username: { type: String, min: 4, max: 20, required: true },
    firstname: { type: String, required: true },
    lastname: String,
    password: { type: String, required: true },
    isMember: { type: Boolean, required: true },
});

UserSchema.virtual('url').get(function (): string {
    return `/users/${this._id}`;
});

export const User = model<UserModel>('user', UserSchema);
