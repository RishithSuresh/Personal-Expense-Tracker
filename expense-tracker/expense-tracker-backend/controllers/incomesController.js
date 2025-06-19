import { db } from '../db.js';

export const getIncomes = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM incomes ORDER BY date DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addIncome = async (req, res) => {
    const { amount, source, date, description } = req.body;
    if (!amount || !date) {
        return res.status(400).json({ error: 'Amount and date are required' });
    }
    try {
        await db.query(
            'INSERT INTO incomes (amount, source, date, description) VALUES (?, ?, ?, ?)',
            [amount, source, date, description]
        );
        res.json({ message: 'Income added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM incomes WHERE id = ?', [id]);
        res.json({ message: 'Income deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};