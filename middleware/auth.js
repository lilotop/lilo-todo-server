let jwt = require('jsonwebtoken');
let ErrorResponse = require('../utils/errorResponse');
let asyncHandler = require('../middleware/async');
let User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        // skip the 'Bearer ' part and get to the token
        let parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            token = parts[1];
        }
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('No token provided for protected route. Did the user login?', 401));
    }
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        if(!req.user){
            return next(new ErrorResponse(`User with id ${decoded.id} was not found in DB`, 401));
        }
        next();
    }
    catch (err) {
        return next(new ErrorResponse('Invalid token provided.', 401));
    }

});

