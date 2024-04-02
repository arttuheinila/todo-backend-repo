const express = require('express');
const todoController = require('../controllers/todoController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Applying the authenticateToken middleware to all routes to protect them
router.use(authenticateToken);

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;