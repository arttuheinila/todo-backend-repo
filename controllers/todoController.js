const pool = require('../db');

exports.createTodo = async (req, res) => {
    const { content, is_completed = false } = req.body;
    // userId is extracted from JWT after successful authentication
    // const userId = req.user.id; 
// Temporary bypass for testing!!**
    const userId = 1;

    if (!content) {
        return res.status(400).send('Content is required');
    }

    try {
        const newTodo = await pool.query(
            'Insert INTO todos (content, is_completed, user_id) VALUES ($1, $2, $3) RETURNING *',
            [content, is_completed, userId]
        );
        res.status(201).json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Retrieve all To-Dos for a user
exports.getAllTodos = async (req, res) => {
    // const userId = req.user.id;
// Temporary bypass for testing!!**
    const userId = 1;

    try {
        const allTodos = await pool.query(
            'SELECT * FROM todos WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(allTodos.rows);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error');
    }
};

// Update an existing To-Do
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { content, is_completed } = req.body;
    // const userId = req.user.id;
// Temporary bypass for testing!!**
const userId = 1;


    try {
        const updatedTodo = await pool.query(
            'UPDATE todos SET content = $1, is_completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [content, is_completed, id, userId]
        );

        if (updatedTodo.rows.length === 0) {
            res.status(404).send('Todo not found');
        }

        res.status(200).json(updatedTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete an existing To-Do
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    // const userId = req.user.id;
    // Temporary bypass for testing!!**
    const userId = 1;


    try {
        const deleteOp = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleteOp.rows.length === 0) {
            return res.status(404).send('To-Do not found')
        }

        res.status(200).send('To-Do deleted successfully')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}