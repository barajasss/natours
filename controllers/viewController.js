const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
    // GET tour data from collection
    const tours = await Tour.find();
    // Build template

    // render that template using tour data from step 1
    res.status(200).render('overview', {
        title: 'All tours',
        tours: tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // console.log(req.params.tourSlug);
    const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour,
    });
});

exports.getAccount = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Dashboard',
    });
};

exports.getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            runValidators: true,
        }
    );
    res.redirect('/me');
});

exports.getMyTours = catchAsync(async (req, res, next) => {
    // find all bookings
    const bookings = await Booking.find({
        user: req.user.id,
    });
    // find tours with the returned ID's
    const tourIds = bookings.map((el) => el.tour.id);
    const tours = await Tour.find({ _id: { $in: tourIds } });
    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking') {
        res.locals.alert = `Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.`;
    }
    next();
};
