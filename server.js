let path = require('path');
let dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
let express = require('express');
let morgan = require('morgan');
let colors = require('colors');
let connectDB = require('./config/db');
let cors = require('cors');
let cookieParser = require('cookie-parser');

// setup sentry monitoring
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://a095458261174c5c984aef9ec73dfcd0@sentry.io/3112660' });

// middleware
let errorHandler = require('./middleware/error');
let { protect } = require('./middleware/auth');

// route files
let todoRoutes = require('./routes/todos');
let projectRoutes = require('./routes/projects');
let authRoutes = require('./routes/auth');

// connect to db
connectDB();

let app = express();

// enable cross origin resource sharing
app.use(cors());

// enable req.body access
app.use(express.json());

// enable structured cookie access
app.use(cookieParser());

// log middleware, only run in dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// setup a folder to be accessible as public (for static assets)
app.use(express.static(path.join(__dirname, 'public')));

// setup the routes
app.use('/api/v1/todos', protect, todoRoutes);
app.use('/api/v1/projects', protect, projectRoutes);
app.use('/api/v1/auth', authRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4242;

let server = app.listen(PORT, console.log(`Server running in mode: ${process.env.NODE_ENV} on port: ${PORT}`.blue));

// handle errors
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`.red);
});
