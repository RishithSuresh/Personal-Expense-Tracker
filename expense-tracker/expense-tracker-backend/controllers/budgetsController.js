import { db } from '../db.js';

export const getBudgets = async (req, res) => {
    const { userId } = req.params;
    const [rows] = await db.query(
        `SELECT b.*, c.name as category_name 
         FROM budgets b 
         JOIN categories c ON b.category_id = c.id 
         WHERE b.user_id = ?`, [userId]);
    res.json(rows);
};

export const addBudget = async (req, res) => {
    const { category_id, limit_amount, spent_amount, user_id } = req.body;
    await db.query(
        'INSERT INTO budgets (category_id, limit_amount, spent_amount, user_id) VALUES (?, ?, ?, ?)',
        [category_id, limit_amount, spent_amount || 0, user_id]
    );
    res.json({ message: 'Budget added' });
};

export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { limit_amount, spent_amount } = req.body;
    await db.query(
        'UPDATE budgets SET limit_amount = ?, spent_amount = ? WHERE id = ?',
        [limit_amount, spent_amount, id]
    );
    res.json({ message: 'Budget updated' });
};

export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM budgets WHERE id = ?', [id]);
    res.json({ message: 'Budget deleted' });
};