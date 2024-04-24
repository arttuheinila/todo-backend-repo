const pool = require('../db');

exports.createTodo = async (req, res) => {
    const { content, is_completed = false, is_starred = false } = req.body;
    // userId is extracted from JWT after successful authentication
    const userId = req.user.userId; 

    if (!content) {
        return res.status(400).send('Content is required');
    }

    try {
        const newTodo = await pool.query(
            'Insert INTO todos (content, is_completed, is_starred, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [content, is_completed, is_starred, userId]
        );
        res.status(201).json(newTodo.rows[0]);
    } catch (err) {
        console.error("Error when creating todo:", err.message);
        if (err.code === '23502') { // not-null violation
            console.error("Detail:", err.detail);
        }
        res.status(500).send('Server error');
    }    
};

// Retrieve all To-Dos for a user
exports.getAllTodos = async (req, res) => {
    const userId = req.user.userId; 
    // const userId = 5
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
    const userId = req.user.userId;
    const { id } = req.params;
    const { content, is_completed, is_starred } = req.body;

    console.log('Logged in user from token:', req.user);
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);

    try {
        const result = await pool.query(
            'UPDATE todos SET content = $1, is_completed = $2, is_starred = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [content, is_completed, is_starred, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found or user mismatch" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Update error:', err.message);
        res.status(500).json({ message: 'Server error during todo update' });
    }
};

// Delete an existing To-Do
exports.deleteTodo = async (req, res) => {
    const userId = req.user.userId; 
    const { id } = req.params;
 
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