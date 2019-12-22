let Project = require('../models/Project');
let ErrorResponse = require('../utils/errorResponse');
let asyncHandler = require('../middleware/async');

exports.getProjects = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults); // set by the advancedResults middleware (see routes file)
});

exports.createProject = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id; // req.user provided by auth/protect middleware
    let project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
});

exports.getProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findById(req.params.id);
    if (project) {
        return res.json({ success: true, data: project });
    } else {
        throw new ErrorResponse('No such project. check the id', 404);
    }
});

exports.updateProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (project) {
        return res.json({ success: true, data: project });
    } else {
        throw new ErrorResponse('No such project. check the id', 404);
    }
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findById(req.params.id);
    if (project) {
        await project.remove();
        return res.json({ success: true, data: {} });
    } else {
        throw new ErrorResponse('No such project. check the id', 404);
    }
});
