// 3rd party modules
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const cors = require('cors');

// Start express application
const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// implement CORS
app.use(cors());
// Access-Control-Allow-Origin, *
// eg, backend: api.natours.com, frontend: natours.com
// app.use(cors({ origin: 'https://www.natours.com' }))

// for prefligh requests
// not necessary when using app.use(cors()) as an application level middlewre
// only when implmeneted in a single route to allow for complex requests - PUT, PATCH, DELETE, etc.
// app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

//routers

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// Middlewares

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(compression());

// Data sanitization against nosql injection
app.use(mongoSanitize());
// XSS protection
app.use(xss());
// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'ratingsAverage',
            'ratingsQuantity',
            'duration',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    const err = new AppError(`url ${req.originalUrl}  could not be found`, 404);
    next(err);
});
app.use(globalErrorHandler);

module.exports = app;
