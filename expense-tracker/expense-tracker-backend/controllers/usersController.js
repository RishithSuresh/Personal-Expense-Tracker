import { db } from '../db.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
        res.json({ message: 'User registered' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user.id, username: user.username });
};

export const getUsers = async (req, res) => {
    const [rows] = await db.query('SELECT id, username FROM users');
    res.json(rows);
};