let express = require('express');
let { createProject, deleteProject, getProject, getProjects, updateProject } = require('../controllers/projects');

// this is for adding the advanced results middleware
let advancedResults = require('../middleware/advancedResults');
let Project = require('../models/Project');


let router = express.Router();

router.route('/').get(advancedResults(Project), getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);
module.exports = router;
