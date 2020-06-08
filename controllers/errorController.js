const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value ${err.keyValue.name}, Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (err) =>
    new AppError('Invalid JSON Web Token. Please log in', 401);

const handleJWTExpiredError = (err) =>
    new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
    return res.status(err.statusCode).render('error', {
        title: 'Oops an error!',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    // Operational, trusted error: send message to client

    if (err.isOperational) {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // RENDERED WEBSITE
        return res.status(err.statusCode).render('error', {
            title: 'Oops an error!',
            msg: err.message,
        });
        // Programming or other unknown error
    } else {
        // 1) Log Error
        console.error('ERROR ', err);

        // SEND A GENERIC MESSAGE
        if (req.originalUrl.startsWith('/api')) {
            return res.status(500).json({
                status: 'error',
                message: 'Something went wrong...',
            });
        }
        // RENDERED WEBSITE
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
        });
    }
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err, message: err.message };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError(error);
        sendErrorProd(error, req, res);
    } else {
        sendErrorDev(err, req, res);
    }
};
