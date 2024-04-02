const express = require('express');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
// Middleware for parsing JSON bodies
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

