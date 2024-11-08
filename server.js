const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'boity@2002',
  database: 'Wings_cafe',
};

// Connect to MySQL database
let db;
mysql.createConnection(dbConfig)
  .then((connection) => {
    db = connection;
    console.log('Connected to MySQL database');
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit if connection fails
  });

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM inventorymanagement');
    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  const { ProductName, Description, Category, Price, InitialQuality, Stock } = req.body;
  if (!ProductName || !Price || !Stock) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    await db.execute(
      'INSERT INTO inventorymanagement (ProductName, Description, Category, Price, InitialQuality, Stock) VALUES (?, ?, ?, ?, ?, ?)',
      [ProductName, Description, Category, Price, InitialQuality, Stock]
    );
    return res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { ProductName, Description, Category, Price, InitialQuality, Stock } = req.body;
  if (!ProductName || !Price || !Stock) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    await db.execute(
      'UPDATE inventorymanagement SET ProductName = ?, Description = ?, Category = ?, Price = ?, InitialQuality = ?, Stock = ? WHERE id = ?',
      [ProductName, Description, Category, Price, InitialQuality, Stock, id]
    );
    return res.json({ message: 'Product updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM inventorymanagement WHERE id = ?', [id]);
    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete out-of-stock products (or mark them as out of stock)
app.delete('/api/products/outofstock', async (req, res) => {
  try {
    // Instead of deleting, consider updating the status
    await db.execute('UPDATE inventorymanagement SET status = "out_of_stock" WHERE Stock = 0');
    return res.json({ message: 'Out-of-stock products marked successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const [results] = await db.execute('SELECT * FROM login WHERE username = ?', [username]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute('INSERT INTO login (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return res.status(200).json({ message: 'Registration successful!' });
  } catch (err) {
    return res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const [results] = await db.execute('SELECT * FROM login WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Username not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    return res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    return res.status(500).json({ message: 'Error comparing passwords' });
  }
});

// Graceful server shutdown
process.on('SIGINT', async () => {
  console.log('Closing MySQL connection...');
  try {
    await db.end();
    console.log('MySQL connection closed.');
  } catch (err) {
    console.error('Error closing MySQL connection:', err);
  }
  process.exit();
});

app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM InventoryManagement';
  
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching products', error: err });
      }
      res.json(results);
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
