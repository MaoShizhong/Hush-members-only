import express, { Request, Response } from 'express';

export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', (req: Request, res: Response): void => {
    res.render('home');
});

indexRouter.get('/signup', (req: Request, res: Response): void => {
    res.render('signup');
});

indexRouter.get('/login', (req: Request, res: Response): void => {
    res.render('login');
});
