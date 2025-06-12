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
const TODOS_FILE = path.join(__dirname, 'todos.json');

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function loadTodos() {
    if (!fs.existsSync(TODOS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TODOS_FILE));
}

function saveTodos(todos) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

function validatePassword(password) {
    return /[A-Z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password) &&
           password.length >= 8;
}

app.post('/signup', (req, res) => {
    const { email, password, role } = req.body;
    if (typeof password !== 'string' || !validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include an uppercase letter, a number, and a symbol.' });
    }
    let users = loadUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered.' });
    }
    // Default role to 'user' if not provided
    users.push({ email, password, role: role === 'admin' ? 'admin' : 'user' });
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

// Middleware to get user role from request (simple version: email in body)
function getUserRole(req) {
    const { email } = req.body || req.query || {};
    if (!email) return 'guest';
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    return user ? (user.role || 'user') : 'guest';
}

// Get all todos (public)
app.get('/todos', (req, res) => {
    const todos = loadTodos();
    res.json(todos);
});

// Create todo (admin only)
app.post('/todos', (req, res) => {
    const role = getUserRole(req);
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const todos = loadTodos();
    const newTodo = { id: Date.now(), text };
    todos.push(newTodo);
    saveTodos(todos);
    res.json(newTodo);
});

// Update todo (admin or user)
app.put('/todos/:id', (req, res) => {
    const role = getUserRole(req);
    if (role !== 'admin' && role !== 'user') return res.status(403).json({ error: 'Admin or user only' });
    const { id } = req.params;
    const { text } = req.body;
    let todos = loadTodos();
    const idx = todos.findIndex(t => t.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    todos[idx].text = text;
    saveTodos(todos);
    res.json(todos[idx]);
});

// Delete todo (admin only)
app.delete('/todos/:id', (req, res) => {
    const role = getUserRole(req);
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { id } = req.params;
    let todos = loadTodos();
    const idx = todos.findIndex(t => t.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const removed = todos.splice(idx, 1);
    saveTodos(todos);
    res.json(removed[0]);
});

// Endpoint to get all users (for role lookup, not for production use)
app.get('/users', (req, res) => {
    const users = loadUsers();
    res.json(users.map(u => ({ email: u.email, role: u.role || 'user' })));
});

app.listen(3005, () => console.log('Server running on port 3005'));
