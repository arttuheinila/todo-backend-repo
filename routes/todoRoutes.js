const express = require('express');
const todoController = require('../controllers/todoController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Applying the authenticateToken middleware to all routes to protect them
// **COMMENT OUT FOR TESTING
// router.use(authenticateToken);

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;