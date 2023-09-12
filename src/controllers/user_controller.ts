import { User } from '../models/User';
import { Post } from '../models/Post';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

// Show profile
export const showProfile = expressAsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user = await User.findOne({ username: req.params.username }).exec();

        if (!user) res.redirect('/?too_loud=go_away');

        res.render('profile', {
            user: user,
        });
    }
);

// Confirm account delete
export const confirmDeleteAccount = (req: Request, res: Response): void =>
    res.render('delete_account');

// Actually delete account
export const deleteAccount = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userToBeDeleted = await User.findOne({ username: req.params.username }).exec();

        await Promise.all([
            Post.deleteMany({ author: userToBeDeleted?._id }).exec(),
            User.deleteOne({ username: req.params.username }).exec(),
        ]);

        req.logout((err) => {
            if (err) return next(err);

            res.redirect('/');
        });
    }
);
