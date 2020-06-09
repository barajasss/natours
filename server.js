const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    // console.log(`Running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED, Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
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
    .then((db) => {
        console.log('successfull database connection');
    })
    .catch((err) => {
        console.log('Database Connection erorr', err);
    });
