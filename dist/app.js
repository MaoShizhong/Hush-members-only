"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("./models/User");
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
const app = (0, express_1.default)();
/*
    - Mongoose setup
*/
(0, dotenv_1.configDotenv)();
mongoose_1.default.set('strictQuery', false);
const main = () => __awaiter(void 0, void 0, void 0, function* () { return yield mongoose_1.default.connect(process.env.CONNECTION_STRING); });
main().catch((err) => console.error(err));
/*
    - Initiliase Passport local Strategy
*/
passport_1.default.use(new passport_local_1.default.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        const matchingPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!matchingPassword) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
/*
    ! Disable `any` rule this one time - Express.User.id does not exist in the interface
    ! Unable to extend interface without using namespace - type not included in
    ! @types/express nor any passport @types
*/
// eslint-disable-next-line
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
/*
    - Locals
*/
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
/*
    - Initialise middleware
*/
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, express_session_1.default)({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/*
    - Routers
*/
app.use('/', index_1.indexRouter);
app.use('/users', users_1.usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
