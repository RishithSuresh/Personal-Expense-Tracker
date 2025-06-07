// filepath: personal-expense-tracker-frontend/app.js

document.addEventListener('DOMContentLoaded', function() {
    // --------- Expenses Table Display & Add ---------
    const expensesTableBody = document.getElementById('expensesTableBody');
    const addExpenseForm = document.querySelector('.add-expense-form');

    // Function to fetch and render expenses
    async function renderExpenses() {
        const res = await fetch('http://localhost:3001/api/expenses');
        const expenses = await res.json();
        expensesTableBody.innerHTML = '';
        if (expenses.length === 0) {
            expensesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No expenses to display</td></tr>`;
        } else {
            expenses.forEach(exp => {
                expensesTableBody.innerHTML += `
                    <tr>
                        <td>${exp.date || ''}</td>
                        <td>${exp.description || ''}</td>
                        <td>${exp.category || ''}</td>
                        <td>₹${exp.amount || 0}</td>
                        <td>${exp.payment_method || ''}</td>
                    </tr>
                `;
            });
        }
        // Optionally, update dashboard charts here if needed
        if (typeof loadDashboard === 'function') loadDashboard();
    }

    // Handle add expense form submit
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const inputs = addExpenseForm.querySelectorAll('input, select');
            const date = inputs[0].value;
            const description = inputs[1].value;
            const category = inputs[2].value;
            const amount = parseFloat(inputs[3].value);
            const paymentMethod = inputs[4].value;

            const response = await fetch('http://localhost:3001/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, description, category, amount, paymentMethod })
            });

            if (response.ok) {
                addExpenseForm.reset();
                await renderExpenses(); // Update table immediately
            } else {
                const error = await response.json();
                alert('Failed to add expense: ' + (error.error?.sqlMessage || error.error || 'Unknown error'));
            }
        });
    }

    // Initial render
    if (expensesTableBody) renderExpenses();
});

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>