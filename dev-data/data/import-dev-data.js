const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const pathL = require('path');

dotenv.config({
    path: pathL.join(__dirname, '../../.env'),
});

let DB;
if (process.env.USE_LOCAL_DB === 'true') {
    DB = process.env.DATABASE_LOCAL;
} else {
    DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
    );
}

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('Connected database successfully');
    })
    .catch((err) => {
        console.log('Database Connection erorr', err);
    });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import data to database

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

// Delete all data from collection

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('Deleted all data');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
