let express = require('express');
let { protect } = require('../middleware/auth');
let {register, login, getCurrentUser} = require('../controllers/auth');

let router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', protect, getCurrentUser);
module.exports = router;
