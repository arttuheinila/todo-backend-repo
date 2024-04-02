const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');


exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

  exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the user exists
      const userQueryResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (userQueryResult.rows.length > 0) {
        const user = userQueryResult.rows[0]
        
        // Compare the provided password with the stored hash
        const isValidPassword = await bcrypt.compare(password, user.password)
        
        if (isValidPassword) {
          // Valid password, create the token
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
          
          // Send back the token
          res.json({ token })
        } else {
          // Password is incorrect 
          res.status(401).send('Invalid credentials')
        }
      } else {
        // User does not exist
        res.status(401).send('User not found')
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error')
    }
  };
