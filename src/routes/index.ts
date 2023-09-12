import { Router } from 'express';
import * as indexController from '../controllers/index_controller';

export const indexRouter = Router();

/* GET home page. */
indexRouter.get('/', indexController.getHomepage);

/* GET signup page */
indexRouter.get('/signup', indexController.getSignupPage);

/* POST submit signup form */
indexRouter.post('/signup', indexController.registerAccount);

/* GET login page */
indexRouter.get('/login', indexController.getLoginPage);

/* POST login attempt */
indexRouter.post('/login', indexController.attemptLogin);

// Logout
indexRouter.get('/logout', indexController.logout);

indexRouter.post('/join', indexController.joinSecretClub);
