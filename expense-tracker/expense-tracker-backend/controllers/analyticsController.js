import { db } from '../db.js';

export const getMonthlyAnalytics = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                YEAR(date) as year,
                MONTH(date) as month,
                MONTHNAME(date) as month_name,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
                 SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as net_savings
            FROM (
                SELECT date, amount, 'expense' as type FROM expenses
                UNION ALL
                SELECT date, amount, 'income' as type FROM incomes
            ) combined
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY YEAR(date), MONTH(date)
            ORDER BY year DESC, month DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getYearlyAnalytics = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                YEAR(date) as year,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
                 SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as net_savings,
                COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count,
                COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count
            FROM (
                SELECT date, amount, 'expense' as type FROM expenses
                UNION ALL
                SELECT date, amount, 'income' as type FROM incomes
            ) combined
            GROUP BY YEAR(date)
            ORDER BY year DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSpendingTrends = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.name as category,
                YEAR(e.date) as year,
                MONTH(e.date) as month,
                SUM(e.amount) as total_amount,
                COUNT(*) as transaction_count,
                AVG(e.amount) as avg_amount
            FROM expenses e
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY c.name, YEAR(e.date), MONTH(e.date)
            ORDER BY year DESC, month DESC, total_amount DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getFinancialHealth = async (req, res) => {
    try {
        const [currentMonth] = await db.query(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expenses,
                (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
                 SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as monthly_savings
            FROM (
                SELECT amount, 'income' as type FROM incomes 
                WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
                UNION ALL
                SELECT amount, 'expense' as type FROM expenses 
                WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
            ) current_month
        `);

        const [lastMonth] = await db.query(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expenses
            FROM (
                SELECT amount, 'income' as type FROM incomes 
                WHERE MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
                AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                UNION ALL
                SELECT amount, 'expense' as type FROM expenses 
                WHERE MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
                AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            ) last_month
        `);

        const [yearToDate] = await db.query(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as ytd_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as ytd_expenses
            FROM (
                SELECT amount, 'income' as type FROM incomes 
                WHERE YEAR(date) = YEAR(CURDATE())
                UNION ALL
                SELECT amount, 'expense' as type FROM expenses 
                WHERE YEAR(date) = YEAR(CURDATE())
            ) ytd
        `);

        const current = currentMonth[0];
        const last = lastMonth[0];
        const ytd = yearToDate[0];

        const savingsRate = current.monthly_income > 0 ? 
            ((current.monthly_savings / current.monthly_income) * 100).toFixed(2) : 0;

        const expenseGrowth = last.monthly_expenses > 0 ? 
            (((current.monthly_expenses - last.monthly_expenses) / last.monthly_expenses) * 100).toFixed(2) : 0;

        const incomeGrowth = last.monthly_income > 0 ? 
            (((current.monthly_income - last.monthly_income) / last.monthly_income) * 100).toFixed(2) : 0;

        res.json({
            current_month: current,
            last_month: last,
            year_to_date: ytd,
            metrics: {
                savings_rate: parseFloat(savingsRate),
                expense_growth: parseFloat(expenseGrowth),
                income_growth: parseFloat(incomeGrowth),
                financial_health_score: calculateHealthScore(current, savingsRate)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTopExpenseCategories = async (req, res) => {
    const { period = '30' } = req.query; // days
    
    try {
        const [rows] = await db.query(`
            SELECT 
                c.name as category,
                SUM(e.amount) as total_amount,
                COUNT(*) as transaction_count,
                AVG(e.amount) as avg_amount,
                ROUND((SUM(e.amount) / (SELECT SUM(amount) FROM expenses 
                    WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY))) * 100, 2) as percentage
            FROM expenses e
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY c.name
            ORDER BY total_amount DESC
            LIMIT 10
        `, [period, period]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getIncomeSourceAnalysis = async (req, res) => {
    const { period = '30' } = req.query; // days
    
    try {
        const [rows] = await db.query(`
            SELECT 
                source,
                SUM(amount) as total_amount,
                COUNT(*) as transaction_count,
                AVG(amount) as avg_amount,
                ROUND((SUM(amount) / (SELECT SUM(amount) FROM incomes 
                    WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY))) * 100, 2) as percentage
            FROM incomes
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            AND source IS NOT NULL AND source != ''
            GROUP BY source
            ORDER BY total_amount DESC
        `, [period, period]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDailySpendingPattern = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DAYNAME(date) as day_name,
                DAYOFWEEK(date) as day_number,
                AVG(daily_total) as avg_spending
            FROM (
                SELECT 
                    date,
                    SUM(amount) as daily_total
                FROM expenses
                WHERE date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
                GROUP BY date
            ) daily_expenses
            GROUP BY DAYOFWEEK(date), DAYNAME(date)
            ORDER BY day_number
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to calculate financial health score
function calculateHealthScore(current, savingsRate) {
    let score = 0;
    
    // Savings rate component (40% of score)
    if (savingsRate >= 20) score += 40;
    else if (savingsRate >= 10) score += 30;
    else if (savingsRate >= 5) score += 20;
    else if (savingsRate > 0) score += 10;
    
    // Income vs expenses ratio (30% of score)
    const ratio = current.monthly_income > 0 ? current.monthly_expenses / current.monthly_income : 1;
    if (ratio <= 0.5) score += 30;
    else if (ratio <= 0.7) score += 25;
    else if (ratio <= 0.8) score += 20;
    else if (ratio <= 0.9) score += 15;
    else if (ratio < 1) score += 10;
    
    // Positive savings (30% of score)
    if (current.monthly_savings > 0) score += 30;
    else if (current.monthly_savings === 0) score += 15;
    
    return Math.min(score, 100);
}
