let path = require('path');
let dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
let express = require('express');
let morgan = require('morgan');
let colors = require('colors');
let connectDB = require('./config/db');
let errorHandler = require('./middleware/error');
let cors = require('cors');

// route files
let todoRoutes = require('./routes/todos');

// connect to db
connectDB();

let app = express();

app.use(cors());

// enable req.body access
app.use(express.json());

// log middleware, only run in dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// setup a folder to be accessible as public (for static assets)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/todos', todoRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4242;

let server = app.listen(PORT, console.log(`Server running in mode: ${process.env.NODE_ENV} on port: ${PORT}`.blue));

// handle errors
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`.red);
    // close server and exit process
    server.close(()=> process.exit(1));
});
