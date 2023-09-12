import { Post } from '../models/Post';
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

// List of all posts - default homepage for secret club members
export const showPosts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.find().populate('author').sort({ timestamp: -1 }).exec();

    res.render('posts', { posts: posts });
});

export const getNewPostForm = (req: Request, res: Response): void => {
    res.render('new_post');
};

export const addNewPost = [
    body('title', 'Title cannot be empty').trim().notEmpty().escape(),

    body('text', 'Message body cannot be empty')
        .trim()
        .notEmpty()
        .customSanitizer((text: string): string[] =>
            text.replaceAll('\r', '').replaceAll(/\n+/g, '\n').split('\n')
        )
        .escape(),

    expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('new_post', {
                errors: errors.array(),
            });
        }

        const post = new Post({
            author: req.user!._id,
            title: req.body.title,
            timestamp: new Date(),
            text: req.body.text,
        });

        await post.save();
        res.redirect('/posts');
    }),
];

export const deletePost = expressAsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const existingPost = await Post.findById(req.params.id).exec();

        if (!existingPost) return res.redirect('/?too_loud=go_away');

        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/posts');
    }
);
