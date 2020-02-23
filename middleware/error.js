let errorHandler = (err, req, res, next) => {
    console.log(err.stack.red); // (using colors.js extension)
    let errorCategory;
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        errorCategory = 'validation';
    } else if (err.code === 11000) {
        err.statusCode = 400;
        errorCategory = 'duplicate';
    }
    res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Server Error', errorCategory });
};

module.exports = errorHandler;
