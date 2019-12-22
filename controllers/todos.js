let Todo = require('../models/Todo');
let Project = require('../models/Project');
let ErrorResponse = require('../utils/errorResponse');
let asyncHandler = require('../middleware/async');

exports.getTodos = asyncHandler(async (req, res, next) => {
    res.json(res.advancedResults); // set by the advancedResults middleware (see routes file)
});

exports.createTodo = asyncHandler(async (req, res, next) => {

    let project = await Project.findById(req.body.project);
    if (project) {
        req.body.user = req.user._id; // req.user provided by auth/protect middleware
        let todo = await Todo.create(req.body);
        res.status(201).json({ success: true, data: todo });
    } else {
        throw new ErrorResponse('No such project. check the project id', 404);
    }



});

exports.getTodo = asyncHandler(async (req, res, next) => {
    let todo = await Todo.findById(req.params.id);
    if (todo) {
        return res.json({ success: true, data: todo });
    } else {
        throw new ErrorResponse('No such todo. check the id', 404);
    }
});

exports.updateTodo = asyncHandler(async (req, res, next) => {
    let todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (todo) {
        return res.json({ success: true, data: todo });
    } else {
        throw new ErrorResponse('No such todo. check the id', 404);
    }
});

exports.deleteTodo = asyncHandler(async (req, res, next) => {
    let todo = await Todo.findById(req.params.id);
    if (todo) {
        await todo.remove();
        return res.json({ success: true, data: {} });
    } else {
        throw new ErrorResponse('No such todo. check the id', 404);
    }
});
