import { Schema, Types, model } from 'mongoose';

type PostModel = {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    title: string;
    timestamp: Date;
    text: string[];
    url: string;
};

const PostSchema = new Schema<PostModel>({
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, required: true },
    text: { type: [String], required: true },
});

PostSchema.virtual('url').get(function (): string {
    return `/posts/${this._id}`;
});

export const Post = model<PostModel>('post', PostSchema);
