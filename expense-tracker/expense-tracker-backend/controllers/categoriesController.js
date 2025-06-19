import { db } from '../db.js';

export const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, color, icon, description FROM categories ORDER BY name');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addCategory = async (req, res) => {
    const { name, color, icon, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        await db.query(
            'INSERT INTO categories (name, color, icon, description) VALUES (?, ?, ?, ?)',
            [name, color || '#ff4c29', icon || '📝', description || '']
        );
        res.json({ message: 'Category added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, color, icon, description } = req.body;

    try {
        await db.query(
            'UPDATE categories SET name = ?, color = ?, icon = ?, description = ? WHERE id = ?',
            [name, color, icon, description, id]
        );
        res.json({ message: 'Category updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
};