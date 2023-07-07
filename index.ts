import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Replace this with your own secret key (keep it secure!)
const secretKey = 'your-secret-key';

// Mock user data (replace with a database in a real application)
const users: { [key: string]: string } = {};

app.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Check if the username is already taken
  if (users[username]) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);
  
  // Save the user data
  users[username] = hashedPassword;
  
  res.status(201).json({ message: 'Registration successful' });
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Check if the username exists
  if (!users[username]) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  // Compare the provided password with the stored hashed password
  if (!bcrypt.compareSync(password, users[username])) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  // Generate a JWT token
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  
  res.json({ token });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
