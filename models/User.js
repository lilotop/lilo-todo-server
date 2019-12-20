let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let UserSchema = mongoose.Schema({
   name: {
       type: String,
       required: [true,'Name is required'],
       unique: true,
   },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: true,
        match: [
            /\S+@\S+\.\S+/,
            'Please enter a valid email address'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: [true,'Password is required'],
        minlength: 6,
        select: false // so the password will not be returned when browsing users
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// get a JWT for the user instance
UserSchema.methods.getToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// validate password for a user instance
UserSchema.methods.validatePassword = async function(providedPassword) {
    return await bcrypt.compare(providedPassword, this.password);
};

UserSchema.pre('save', async function(next) {
    this.modifiedAt = Date.now();
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
