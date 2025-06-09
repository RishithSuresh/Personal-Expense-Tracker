// This file contains the JavaScript code for the Expense Tracker website.
// It handles user interactions, data management, and dynamic content updates.

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    loadExpenses();
    loadBudget();
    loadCategories();
});

// Function to load expenses
function loadExpenses() {
    // Placeholder for loading expenses logic
    console.log("Loading expenses...");
}

// Function to load budget
function loadBudget() {
    // Placeholder for loading budget logic
    console.log("Loading budget...");
}

// Function to load categories
function loadCategories() {
    // Placeholder for loading categories logic
    console.log("Loading categories...");
}

// Function to add a new expense
function addExpense(expense) {
    // Placeholder for adding expense logic
    console.log("Adding expense:", expense);
}

// Function to update budget
function updateBudget(newBudget) {
    // Placeholder for updating budget logic
    console.log("Updating budget to:", newBudget);
}

// Function to categorize an expense
function categorizeExpense(expenseId, category) {
    // Placeholder for categorizing expense logic
    console.log("Categorizing expense:", expenseId, "as", category);
}

// Example: Replace these with real data from localStorage or your backend
const budget = localStorage.getItem('budget') || 0;
const income = localStorage.getItem('income') || 0;
const expenses = localStorage.getItem('expenses') || 0;

// Display values on the homepage
if (document.getElementById('current-budget')) {
    document.getElementById('current-budget').textContent = `₱${Number(budget).toLocaleString()}`;
}
if (document.getElementById('total-income')) {
    document.getElementById('total-income').textContent = `₱${Number(income).toLocaleString()}`;
}
if (document.getElementById('total-expenses')) {
    document.getElementById('total-expenses').textContent = `₱${Number(expenses).toLocaleString()}`;
}

// Draw the chart if on the homepage
if (document.getElementById('financeChart')) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Budget', 'Income', 'Expenses'],
            datasets: [{
                label: 'Amount (₱)',
                data: [budget, income, expenses],
                backgroundColor: [
                    '#2d6cdf',
                    '#4caf50',
                    '#e74c3c'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₱' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

function getCategoryData(key) {
    // Returns [{category: "Food", amount: 1000}, ...] or []
    return JSON.parse(localStorage.getItem(key)) || [];
}

function renderPieChart(canvasId, dataArr, chartLabel) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const labels = dataArr.map(item => item.category);
    const data = dataArr.map(item => item.amount);
    const colors = [
        '#2d6cdf', '#4caf50', '#e74c3c', '#f1c40f', '#9b59b6', '#16a085', '#e67e22', '#34495e'
    ];
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: colors,
                borderWidth: 1
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

document.addEventListener('DOMContentLoaded', () => {
    // Render pie charts if on homepage
    renderPieChart('budgetPieChart', getCategoryData('budgetCategories'), 'Budget');
    renderPieChart('incomePieChart', getCategoryData('incomeCategories'), 'Income');
    renderPieChart('expensePieChart', getCategoryData('expenseCategories'), 'Expenses');

    // Toggle expense form
    const showBtn = document.getElementById('show-expense-form');
    const form = document.getElementById('expense-form');
    if (showBtn && form) {
        showBtn.addEventListener('click', () => {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Show/hide budget form
    const showBtnBudget = document.getElementById('show-budget-form');
    const formBudget = document.getElementById('budget-form');
    if (showBtnBudget && formBudget) {
        showBtnBudget.addEventListener('click', () => {
            formBudget.style.display = formBudget.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Handle budget form submission
    const budgetsRow = document.getElementById('budgets-row');
    if (formBudget && budgetsRow) {
        formBudget.addEventListener('submit', function(e) {
            e.preventDefault();
            const category = document.getElementById('budget-category').value;
            const limit = document.getElementById('budget-limit').value;
            const spent = document.getElementById('budget-spent').value;

            // Create card
            const card = document.createElement('div');
            card.className = 'budget-card';
            card.innerHTML = `
                <strong>${category}</strong>
                <table class="budget-table">
                    <tr>
                        <td>Limit:</td>
                        <td class="budget-limit">₹${Number(limit).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Spent:</td>
                        <td class="budget-spent">₹${Number(spent).toLocaleString()}</td>
                    </tr>
                </table>
            `;
            budgetsRow.appendChild(card);

            // Optionally clear form and hide
            formBudget.reset();
            formBudget.style.display = 'none';
        });
    }

    // Handle expense form submission
    const expenseForm = document.getElementById('expense-form');
    const expensesTableBody = document.querySelector('#expenses-table tbody');
    if (expenseForm && expensesTableBody) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;
            const payment = document.getElementById('payment').value;

            // Create a new row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${description}</td>
                <td>${category}</td>
                <td>₱${Number(amount).toLocaleString()}</td>
                <td>${payment}</td>
                <td><button class="delete-expense-btn">Delete</button></td>
            `;
            expensesTableBody.appendChild(row);

            // Optionally clear and hide the form
            expenseForm.reset();
            expenseForm.style.display = 'none';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-expense-btn')) {
            e.target.closest('tr').remove();
        }
    });

    // Add Category functionality
    const addCategoryBtn = document.getElementById('add-category');
    const newCategoryInput = document.getElementById('new-category');
    const categoryList = document.getElementById('category-list');

    if (addCategoryBtn && newCategoryInput && categoryList) {
        addCategoryBtn.addEventListener('click', function () {
            const value = newCategoryInput.value.trim();
            if (value) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
                categoryList.appendChild(tr);
                newCategoryInput.value = '';
            }
        });
    }
});