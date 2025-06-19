import { db } from '../db.js';

export const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addCategory = async (req, res) => {
    const { id, name } = req.body;
    try {
        await db.query('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
        res.json({ message: 'Category added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
};