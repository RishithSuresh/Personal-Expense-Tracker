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

export const getIncomesTotal = async (req, res) => {
    const [rows] = await db.query('SELECT SUM(amount) AS total FROM incomes');
    res.json({ total: rows[0].total || 0 });
};

export const getIncomesBySource = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT source, SUM(amount) as amount
             FROM incomes
             WHERE source IS NOT NULL AND source != ''
             GROUP BY source
             HAVING amount > 0
             ORDER BY amount DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getIncomesTimeSeries = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT DATE(date) as date, SUM(amount) as amount
             FROM incomes
             WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
             GROUP BY DATE(date)
             ORDER BY date ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};