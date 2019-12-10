let express = require('express');
let { createTodo, deleteTodo, getTodo, getTodos, updateTodo } = require('../controllers/todos');

// this is for adding the advanced results middleware
let advancedResults = require('../middleware/advancedResults');
let Todo = require('../models/Todo');


let router = express.Router();

router.route('/').get(advancedResults(Todo), getTodos).post(createTodo);
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);
module.exports = router;
