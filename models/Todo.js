let mongoose = require('mongoose');
let slugify = require('slugify');


let TodoSchema = mongoose.Schema({
        title: {
            type: String,
            required: [true, 'Please enter a title'],
            maxlength: [150, 'Name cannot exceed 150 characters']
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        priority: {
            type: [String],
            enum: [
                'high',
                'normal',
                'low',
            ],
            default: 'normal'
        },
        done: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        modifiedAt: {
            type: Date,
            default: Date.now
        }

    }
);

TodoSchema.pre('save', function(next) {
    this.modifiedAt = Date.now();
    next();
});


module.exports = mongoose.model('Todo', TodoSchema);
