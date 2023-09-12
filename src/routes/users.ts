import { Router } from 'express';
import { isLoggedIn } from './posts';
import { Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user_controller';

export const usersRouter = Router();

const isSameUser = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.username !== req.params.username) {
        res.redirect('/?too_loud=go_away');
    } else {
        next();
    }
};

/* GET user profile */
usersRouter.get('/:username', isLoggedIn, userController.showProfile);

/* GET delete account confirm */
usersRouter.get('/:username/delete', isLoggedIn, isSameUser, userController.confirmDeleteAccount);

/* POST delete account */
usersRouter.post('/:username/delete', isLoggedIn, isSameUser, userController.deleteAccount);
