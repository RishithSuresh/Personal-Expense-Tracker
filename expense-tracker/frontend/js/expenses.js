document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalExpense = document.getElementById('total-expense');

    // Fetch and display expenses on page load
    fetchExpenses();

    // Add event listener for the expense form submission
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(expenseForm);
        const expenseData = {
            name: formData.get('name'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            date: formData.get('date')
        };

        await addExpense(expenseData);
        expenseForm.reset();
        fetchExpenses();
    });

    async function fetchExpenses() {
        const response = await fetch('/api/expenses');
        const expenses = await response.json();
        displayExpenses(expenses);
    }

    async function addExpense(expense) {
        await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
    }

    function displayExpenses(expenses) {
        expenseList.innerHTML = '';
        let total = 0;

        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.name} - $${expense.amount} (${expense.category}) on ${new Date(expense.date).toLocaleDateString()}`;
            expenseList.appendChild(li);
            total += expense.amount;
        });

        totalExpense.textContent = `Total Expenses: $${total.toFixed(2)}`;
        renderChart(expenses);
    }

    function renderChart(expenses) {
        const ctx = document.getElementById('expense-chart').getContext('2d');
        const categories = {};
        
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });

        const chartData = {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(categories),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});