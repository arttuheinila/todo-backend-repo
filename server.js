require('dotenv').config();
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

const app = express();

// Serve static files from the React application
app.use(express.static(path.join(__dirname, '..', 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


// Middleware to handle CORS requests
const corsOptions = {
  origin: ['https://arttu.info', 'https://powerful-reef-86902-97c19a7b8321.herokuapp.com/'],
  credentials: true,
}

app.use(cors(corsOptions));

// Limit requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

