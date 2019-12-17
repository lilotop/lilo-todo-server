let mongoose = require('mongoose');

let TodoSchema = mongoose.Schema({
        title: {
            type: String,
            required: [true, 'Please enter a title'],
            maxlength: [150, 'Title cannot exceed 150 characters']
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        priority: {
            type: Number,
            min: [1, 'Priority start at 1 (highest)'],
            max: [3, 'Priority ends at 3 (lowest)'],
            default: 2
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
        },
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: false
        }


    }
);

TodoSchema.pre('save', function(next) {
    this.modifiedAt = Date.now();
    next();
});


module.exports = mongoose.model('Todo', TodoSchema);
