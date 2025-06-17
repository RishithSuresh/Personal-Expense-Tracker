import { db } from '../db.js';

export const getIncomes = async (req, res) => {
    const { userId } = req.params;
    const [rows] = await db.query('SELECT * FROM incomes WHERE user_id = ?', [userId]);
    res.json(rows);
};

export const addIncome = async (req, res) => {
    const { user_id, amount, source, date } = req.body;
    await db.query(
        'INSERT INTO incomes (user_id, amount, source, date) VALUES (?, ?, ?, ?)',
        [user_id, amount, source, date]
    );
    res.json({ message: 'Income added' });
};

export const deleteIncome = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM incomes WHERE id = ?', [id]);
    res.json({ message: 'Income deleted' });
};