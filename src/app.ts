import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import { configDotenv } from 'dotenv';
import mongoose, { Types } from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import { User } from './models/User';
import { indexRouter } from './routes/index';
import { usersRouter } from './routes/users';

declare global {
    interface Error {
        status?: number;
    }
}

const app = express();

/*
    - Mongoose setup
*/
configDotenv();
mongoose.set('strictQuery', false);

const main = async () => await mongoose.connect(process.env.CONNECTION_STRING!);
main().catch((err): void => console.error(err));

/*
    - Initiliase Passport local Strategy
*/
passport.use(
    new passportLocal.Strategy(async (username: string, password: string, done): Promise<void> => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password' });
            }

            const matchingPassword = await bcrypt.compare(password, user.password);
            if (!matchingPassword) {
                return done(null, false, { message: 'Incorrect username or password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

/*
    ! Disable `any` rule this one time - Express.User.id does not exist in the interface
    ! Unable to extend interface without using namespace - type not included in
    ! @types/express nor any passport @types
*/
// eslint-disable-next-line
passport.serializeUser((user: any, done): void => {
    done(null, user.id);
});

passport.deserializeUser(async (id: Types.ObjectId, done): Promise<void> => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

/*
    - Locals
*/
app.use((req: Request, res: Response, next: NextFunction): void => {
    res.locals.currentUser = req.user;
    next();
});

/*
    - Initialise middleware
*/
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SECRET!, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

/*
    - Routers
*/
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction): void => {
    next(createError(404));
});

// error handler
app.use((err: Error, req: Request, res: Response): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
