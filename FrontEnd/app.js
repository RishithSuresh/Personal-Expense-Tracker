// filepath: personal-expense-tracker-frontend/app.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle adding a new expense
    const addExpenseForm = document.querySelector('.add-expense-form');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = addExpenseForm.querySelector('input[type="date"]').value;
            const description = addExpenseForm.querySelector('input[type="text"]').value;
            const category = addExpenseForm.querySelector('select').value;
            const amount = parseFloat(addExpenseForm.querySelector('input[type="number"]').value);
            const paymentMethod = addExpenseForm.querySelectorAll('select')[1].value;

            // Save to localStorage
            const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.push({ date, description, category, amount, paymentMethod });
            localStorage.setItem('expenses', JSON.stringify(expenses));

            alert('Expense added successfully!');
            addExpenseForm.reset();
            location.reload(); // Refresh to update dashboard
        });
    }

    // Function to handle adding a new budget
    const addBudgetForm = document.querySelector('.add-budget-form');
    if (addBudgetForm) {
        addBudgetForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const category = addBudgetForm.querySelector('select').value;
            const limit = parseFloat(addBudgetForm.querySelector('input[type="number"]').value);

            // Save to localStorage
            const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
            // Update if exists, else add
            const idx = budgets.findIndex(b => b.category === category);
            if (idx !== -1) {
                budgets[idx].limit = limit;
            } else {
                budgets.push({ category, limit });
            }
            localStorage.setItem('budgets', JSON.stringify(budgets));

            alert('Budget added successfully!');
            addBudgetForm.reset();
            location.reload(); // Refresh to update dashboard
        });
    }

    // Function to handle adding a new category
    const addCategoryForm = document.querySelector('.add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const categoryName = addCategoryForm.querySelector('input[type="text"]').value;

            // Save to localStorage
            const categories = JSON.parse(localStorage.getItem('categories') || '["Food","Transport","Utilities"]');
            if (!categories.includes(categoryName)) {
                categories.push(categoryName);
                localStorage.setItem('categories', JSON.stringify(categories));
            }

            alert('Category added successfully!');
            addCategoryForm.reset();
            location.reload(); // Refresh to update dashboard
        });
    }

    // --------- Dashboard Data & Charts ---------
    // Get data
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '["Food","Transport","Utilities"]');

    // Calculate totals
    const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalBudget = budgets.reduce((sum, b) => sum + (parseFloat(b.limit) || 0), 0);
    const remaining = totalBudget - totalSpent;

    // Update summary cards
    const spentElem = document.getElementById('totalSpent');
    const budgetElem = document.getElementById('totalBudget');
    const remainingElem = document.getElementById('remainingBudget');
    if (spentElem) spentElem.textContent = `₹${totalSpent}`;
    if (budgetElem) budgetElem.textContent = `₹${totalBudget}`;
    if (remainingElem) remainingElem.textContent = `₹${remaining}`;

    // Pie Chart: Spending by Category
    const pieCtx = document.getElementById('categoryPieChart');
    if (pieCtx) {
        const categoryTotals = categories.map(cat =>
            expenses.filter(e => e.category === cat)
                    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
        );
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: categoryTotals,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Bar Chart: Monthly Expenses
    const barCtx = document.getElementById('monthlyBarChart');
    if (barCtx) {
        // Get last 6 months
        const now = new Date();
        const months = [];
        const monthTotals = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            months.push(label);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const total = expenses
                .filter(e => e.date && e.date.startsWith(monthStr))
                .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            monthTotals.push(total);
        }
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Expenses',
                    data: monthTotals,
                    backgroundColor: '#36a2eb'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Line Chart: Cumulative Spending (last 4 weeks)
    const lineCtx = document.getElementById('spendingLineChart');
    if (lineCtx) {
        const weeks = [];
        const weekTotals = [];
        const now = new Date();
        for (let i = 3; i >= 0; i--) {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay() - (i * 7));
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const label = `${start.getDate()}/${start.getMonth() + 1}`;
            weeks.push(label);
            const total = expenses
                .filter(e => {
                    const d = new Date(e.date);
                    return d >= start && d <= end;
                })
                .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            weekTotals.push(total);
        }
        // Cumulative sum
        for (let i = 1; i < weekTotals.length; i++) {
            weekTotals[i] += weekTotals[i - 1];
        }
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: weeks,
                datasets: [{
                    label: 'Cumulative Spending',
                    data: weekTotals,
                    borderColor: '#ff6384',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>