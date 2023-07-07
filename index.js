"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Replace this with your own secret key (keep it secure!)
const secretKey = 'your-secret-key';
// Mock user data (replace with a database in a real application)
const users = {};
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Check if the username is already taken
    if (users[username]) {
        return res.status(400).json({ error: 'Username already taken' });
    }
    // Hash the password
    const hashedPassword = bcryptjs_1.default.hashSync(password, 8);
    // Save the user data
    users[username] = hashedPassword;
    res.status(201).json({ message: 'Registration successful' });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if the username exists
    if (!users[username]) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Compare the provided password with the stored hashed password
    if (!bcryptjs_1.default.compareSync(password, users[username])) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Generate a JWT token
    const token = jsonwebtoken_1.default.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
