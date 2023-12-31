import { User } from '../models/User';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import passport from 'passport';

// Show different homepage if logged in or not
export const getHomepage = (req: Request, res: Response): void => {
    if (req.user && req.user.isMember) res.redirect('/posts');

    res.render('home', {
        failedJoin: req.query.join === 'false',
    });
};

export const getSignupPage = (req: Request, res: Response): void => {
    res.render('signup');
};

export const registerAccount = [
    body('username', 'Username must be a minimum of 4 characters (no spaces)')
        .trim()
        .isLength({ min: 4 })
        .escape()
        .custom((username: string): boolean => !username.includes(' '))
        .custom(async (username: string): Promise<void> => {
            const existingUser = await User.findOne({ username: username }).exec();
            if (existingUser) throw new Error('Username already in use');
        }),

    body('firstname', 'First name cannot be empty').trim().notEmpty().escape(),

    body('lastname').trim().escape(),

    body(
        'password',
        'Password must be at least 8 characters long and contain at least 1 letter and one number'
    )
        .trim()
        .custom((password: string): boolean => {
            // Repeat password pattern validatioin on server side
            return /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/.test(password);
        }),

    body('confirm-password', 'Passwords do not match')
        .trim()
        .custom((password: string, { req }): boolean => password === req.body.password),

    expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('errors');
            return res.render('signup', {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                errors: errors.array(),
            });
        }

        // Only hash and create new User if successful account registration
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword): Promise<void> => {
            try {
                const user = new User({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname || undefined,
                    password: hashedPassword,
                    isMember: false,
                    isAdmin: false,
                });

                await user.save();

                req.login(user, (err: Error): void => {
                    if (err) return next(err);
                    res.redirect('/');
                });
            } catch (err) {
                return next(err);
            }
        });
    }),
];

// Get login form
export const getLoginPage = (req: Request, res: Response): void => {
    res.render('login');
};

// Login attempt
export const attemptLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
});

// Logout
export const logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout((err: Error): void => {
        if (err) next(err);
        else res.redirect('/');
    });
};

// Secret club join attempt
export const joinSecretClub = [
    body('secret', 'You are too loud to join us. Access denied.')
        .trim()
        .custom(
            (password: string): boolean =>
                password === '' || password === process.env.ADMIN_PASSWORD
        ),

    expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.redirect('/?join=false');
        }

        const updatedMemberStatus = req.body.secret
            ? { isMember: true, isAdmin: true }
            : { isMember: true };

        await User.findByIdAndUpdate(req.user?._id, updatedMemberStatus);
        res.redirect('/posts');
    }),
];
