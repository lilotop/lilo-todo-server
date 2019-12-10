let mongoose = require('mongoose');
let colors = require('colors');

let connectDB = async () => {
    let conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.blue);
};

module.exports = connectDB;
