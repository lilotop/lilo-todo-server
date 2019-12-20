let User = require('../models/User');
let ErrorResponse = require('../utils/errorResponse');
let asyncHandler = require('../middleware/async');

exports.register = asyncHandler(async (req, res, next) => {
    let { name, email, password } = req.body;

    // create the user
    let user = await User.create({ name, email, password });
    respondWithToken(res, user, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
    let { name, password } = req.body;
    if (!name || !password) {
        return next(new ErrorResponse('Must provide username and password', 400));
    }

    // find the user
    let user = await User.findOne({ name }).select('+password'); // include the password field
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // validate the password
    let isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    respondWithToken(res, user, 200);

});

exports.getCurrentUser = asyncHandler(async (req, res, next) => {

    // req.user is set by the protect middleware
    // get the user object for the current user
    let user = await User.findById(req.user._id);
    res.status(200).json({success: true, data: user});
});


function respondWithToken(res, userObj, statusCode) {

    // create the token for this user
    let token = userObj.getToken();

    // setup the cookie options
    const DAY_IN_MILLISEC = 1000 * 60 * 60 * 24;
    let cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_DAYS * DAY_IN_MILLISEC),
        httpOnly: true
    };

    // send the token back and also set a cookie (using the cookie-parser middleware here)
    res.status(statusCode).cookie('token', token, cookieOptions).json({ success: true, token });

}
