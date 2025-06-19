import { db } from '../db.js';

export const getBudgets = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.*, c.name as category_name,
             COALESCE(SUM(e.amount), 0) as spent_amount,
             (b.limit_amount - COALESCE(SUM(e.amount), 0)) as remaining_amount,
             ROUND((COALESCE(SUM(e.amount), 0) / b.limit_amount) * 100, 2) as percentage_used
             FROM budgets b 
             LEFT JOIN categories c ON b.category_id = c.id 
             LEFT JOIN expenses e ON e.category_id = b.category_id 
                AND MONTH(e.date) = MONTH(CURDATE()) 
                AND YEAR(e.date) = YEAR(CURDATE())
             GROUP BY b.id, b.category_id, b.limit_amount, c.name
             ORDER BY percentage_used DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addBudget = async (req, res) => {
    const { category_id, limit_amount, month, year } = req.body;
    
    if (!category_id || !limit_amount) {
        return res.status(400).json({ error: 'Category ID and limit amount are required' });
    }
    
    try {
        // Check if budget already exists for this category and month
        const [existing] = await db.query(
            'SELECT id FROM budgets WHERE category_id = ? AND month = ? AND year = ?',
            [category_id, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Budget already exists for this category and month' });
        }
        
        await db.query(
            'INSERT INTO budgets (category_id, limit_amount, month, year) VALUES (?, ?, ?, ?)',
            [category_id, limit_amount, month || new Date().getMonth() + 1, year || new Date().getFullYear()]
        );
        res.json({ message: 'Budget added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { limit_amount } = req.body;
    
    try {
        await db.query(
            'UPDATE budgets SET limit_amount = ? WHERE id = ?',
            [limit_amount, id]
        );
        res.json({ message: 'Budget updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.query('DELETE FROM budgets WHERE id = ?', [id]);
        res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBudgetSummary = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                COUNT(*) as total_budgets,
                SUM(b.limit_amount) as total_budget_amount,
                SUM(COALESCE(spent.amount, 0)) as total_spent,
                SUM(b.limit_amount - COALESCE(spent.amount, 0)) as total_remaining,
                ROUND(AVG((COALESCE(spent.amount, 0) / b.limit_amount) * 100), 2) as avg_usage_percentage
             FROM budgets b
             LEFT JOIN (
                SELECT category_id, SUM(amount) as amount
                FROM expenses 
                WHERE MONTH(date) = MONTH(CURDATE()) 
                AND YEAR(date) = YEAR(CURDATE())
                GROUP BY category_id
             ) spent ON b.category_id = spent.category_id
             WHERE b.month = MONTH(CURDATE()) AND b.year = YEAR(CURDATE())`
        );
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBudgetAlerts = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.*, c.name as category_name,
             COALESCE(SUM(e.amount), 0) as spent_amount,
             ROUND((COALESCE(SUM(e.amount), 0) / b.limit_amount) * 100, 2) as percentage_used
             FROM budgets b 
             LEFT JOIN categories c ON b.category_id = c.id 
             LEFT JOIN expenses e ON e.category_id = b.category_id 
                AND MONTH(e.date) = MONTH(CURDATE()) 
                AND YEAR(e.date) = YEAR(CURDATE())
             WHERE b.month = MONTH(CURDATE()) AND b.year = YEAR(CURDATE())
             GROUP BY b.id, b.category_id, b.limit_amount, c.name
             HAVING percentage_used >= 80
             ORDER BY percentage_used DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
