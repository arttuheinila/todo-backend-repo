require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
  console.log(req.method, req.path);
  console.log(req.headers.authorization); // Log the Authorization header
  next();
});
app.use(cors());
// Middleware for parsing JSON bodies
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path, req.headers);
  next();
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

