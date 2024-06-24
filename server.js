require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const rateLimit = require("express-rate-limit");

const app = express();

// Trust the proxy to properly register the client's IP address
app.set('trust proxy', 1); 

// Middleware to handle CORS requests
const corsOptions = {
  origin: ['https://arttu.info', 'https://powerful-reef-86902-97c19a7b8321.herokuapp.com/', 'https://todofrontendrepo.netlify.app', 'https://todo-backend-repo.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// Catch all for non-existent API routes
app.all('*', (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something broke!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

