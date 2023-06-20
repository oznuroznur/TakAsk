const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'takask'
})

connection.connect((err) => {
    if(err){
      console.error('fail to connect ')
    return;
    }
console.log('connected to db');
})

// Register a new user
app.post('/register', (req, res) => {
    const { name, phone, email, password } = req.body;
  
    // Check if the username is already taken
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Failed to execute query:', err);
        return res.status(500).send('Internal server error');
      }
  
      if (results.length > 0) {
        return res.status(409).send('Email zaten var.');
      }
  
      // Hash the password using bcrypt
      bcrypt.hash(password, 20, (err, hash) => {
        if (err) {
          console.error('Failed to hash password:', err);
          return res.status(500).send('Internal server error');
        }
  
        // Insert the new user into the users table
        connection.query('INSERT INTO users (name, phone, email, password) VALUES (?, ?)', [email, hash], (err) => {
          if (err) {
            console.error('Failed to execute query:', err);
            return res.status(500).send('Internal server error');
          }
  
          res.redirect('/login');
        });
      });
    });
  });
  
  // Login route
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Find the user with the matching username
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Failed to execute query:', err);
        return res.status(500).send('Internal server error');
      }
  
      if (results.length === 0) {
        return res.status(401).send('Invalid email');
      }
  
      const user = results[0];
  
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Failed to compare passwords:', err);
          return res.status(500).send('Internal server error');
        }
  
        if (!result) {
          return res.status(401).send('Invalid password');
        }
  
        req.session.userId = user.id;
  
        res.redirect('/dashboard');
      });
    });
  });
  
  // Handle form submission
app.get('/submit', (req, res) => {
    const { name, email, phone, password } = req.body; // Extract form data
  
    // Construct the SQL query
    const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    const values = [name, email, phone, password]; // Values to insert
  
    // Execute the SQL query
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Failed to insert data into the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Data inserted successfully
      res.send('Data inserted into the database');
    });
  });

connection.end((err) => {
   // if(err) {
   // console.error('fail to close')
   // return;
   // }
   // console.log('connection closed');
});