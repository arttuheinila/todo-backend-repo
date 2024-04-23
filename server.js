require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

const app = express();
app.use((req, res, next) => {
  console.log(req.method, req.path);
  console.log(req.headers.authorization); // Log the Authorization header
  next();
});

// Middleware to handle CORS requests
app.use(cors());

// Limit requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

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

