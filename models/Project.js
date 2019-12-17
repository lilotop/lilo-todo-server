let mongoose = require('mongoose');

let ProjectSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please enter a project name'],
            maxlength: [150, 'Name cannot exceed 150 characters']
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
    }
);

ProjectSchema.pre('remove', async function(next) {
    // todo - instead of deleting - we should just clear the project field
    await this.model('Todo').deleteMany({project: this._id});
    next();
});

module.exports = mongoose.model('Project', ProjectSchema);
