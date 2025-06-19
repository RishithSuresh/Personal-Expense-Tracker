import { db } from '../db.js';

export const getExpenses = async (req, res) => {
    const [rows] = await db.query(
        `SELECT e.*, c.name as category_name 
         FROM expenses e 
         LEFT JOIN categories c ON e.category_id = c.id`
    );
    res.json(rows);
};

export const addExpense = async (req, res) => {
    const { category_id, description, amount, payment_method, date } = req.body;
    try {
        await db.query(
            'INSERT INTO expenses (category_id, description, amount, payment_method, date) VALUES (?, ?, ?, ?, ?)',
            [category_id, description, amount, payment_method, date]
        );
        res.json({ message: 'Expense added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ message: 'Expense deleted' });
};

export const getExpensesTotal = async (req, res) => {
    const [rows] = await db.query('SELECT SUM(amount) AS total FROM expenses');
    res.json({ total: rows[0].total || 0 });
};

export const getExpensesByCategory = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.name as category, SUM(e.amount) as amount
             FROM expenses e
             LEFT JOIN categories c ON e.category_id = c.id
             GROUP BY e.category_id, c.name
             HAVING amount > 0
             ORDER BY amount DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getExpensesTimeSeries = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT DATE(date) as date, SUM(amount) as amount
             FROM expenses
             WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
             GROUP BY DATE(date)
             ORDER BY date ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};