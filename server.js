require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function validatePassword(password) {
    return /[A-Z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password) &&
           password.length >= 8;
}

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (typeof password !== 'string' || !validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include an uppercase letter, a number, and a symbol.' });
    }
    let users = loadUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered.' });
    }
    users.push({ email, password });
    saveUsers(users);
    res.json({ message: 'Signup complete.' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    let users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful.' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
