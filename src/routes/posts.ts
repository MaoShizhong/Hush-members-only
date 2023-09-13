import { Router, Response, Request, NextFunction } from 'express';
import * as postsController from '../controllers/posts_controller';

export const postsRouter = Router();

export const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) res.redirect('/?volume=403dBA&too_loud=go_away');
    else next();
};

const isAdminAccount = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.isAdmin) res.redirect('/?volume=403dBA&too_loud=go_away');
    else next();
};

// GET base post board
postsRouter.get('/', isLoggedIn, postsController.showPosts);

// GET new post form
postsRouter.get('/new', isLoggedIn, postsController.getNewPostForm);

// POST submit new post
postsRouter.post('/new', isLoggedIn, postsController.addNewPost);

postsRouter.get('/:id/delete', isLoggedIn, isAdminAccount, postsController.deletePost);
