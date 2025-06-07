const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const expensesRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budget');
const categoryRoutes = require('./routes/category');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/expenses', expensesRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/category', categoryRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API');
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the MySQL database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});