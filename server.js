require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');
const PENDING_2FA = {}; // { email: { code, expires } }

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

function send2FACode(email, code) {
    // Configure your SMTP credentials here
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${code}`
    });
}

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include an uppercase letter, a number, and a symbol.' });
    }
    let users = loadUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered.' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    PENDING_2FA[email] = { code, password, expires: Date.now() + 10 * 60 * 1000 };
    await send2FACode(email, code);
    res.json({ message: '2FA code sent to email. Please verify to complete signup.' });
});

app.post('/verify-signup', (req, res) => {
    const { email, code } = req.body;
    const pending = PENDING_2FA[email];
    if (!pending || pending.code !== code || pending.expires < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired 2FA code.' });
    }
    let users = loadUsers();
    users.push({ email, password: pending.password });
    saveUsers(users);
    delete PENDING_2FA[email];
    res.json({ message: 'Signup complete.' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    let users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    PENDING_2FA[email] = { code, expires: Date.now() + 10 * 60 * 1000 };
    send2FACode(email, code);
    res.json({ message: '2FA code sent to email. Please verify to complete login.' });
});

app.post('/verify-login', (req, res) => {
    const { email, code } = req.body;
    const pending = PENDING_2FA[email];
    if (!pending || pending.code !== code || pending.expires < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired 2FA code.' });
    }
    delete PENDING_2FA[email];
    res.json({ message: 'Login successful.' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
