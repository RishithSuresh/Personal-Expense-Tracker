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
    console.log("Loading expenses...");
    fetchExpenses();
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
        expenseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const category_id = document.getElementById('category_id').value;
            const description = document.getElementById('description').value;
            const amount = document.getElementById('amount').value;
            const payment_method = document.getElementById('payment').value;
            const date = document.getElementById('date').value;

            const response = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id, description, amount, payment_method, date })
            });

            const result = await response.json();
            if (result.message === 'Expense added') {
                this.reset();
                fetchExpenses();
            } else {
                alert('Failed to add expense: ' + (result.error || 'Unknown error'));
            }
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

const API_URL = 'http://localhost:5000/api/categories';

function fetchCategories() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('category-list');
            tbody.innerHTML = '';
            data.forEach(cat => {
                tbody.innerHTML += `
                    <tr>
                        <td>${cat.id}</td>
                        <td>${cat.name}</td>
                    </tr>
                `;
            });
        });
}

document.getElementById('category-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('category_id').value;
    const name = document.getElementById('category_name').value;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    });
    const result = await response.json();
    if (result.message === 'Category added') {
        this.reset();
        fetchCategories();
    } else {
        alert('Failed to add category: ' + (result.error || 'Unknown error'));
    }
});

function fetchExpenses() {
    fetch('http://localhost:5000/api/expenses')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('expenses-body');
            tbody.innerHTML = '';
            data.forEach(exp => {
                tbody.innerHTML += `
                    <tr>
                        <td>${exp.date}</td>
                        <td>${exp.description}</td>
                        <td>${exp.category_id}</td>
                        <td>${exp.amount}</td>
                        <td>${exp.payment_method}</td>
                        <td>
                            <button onclick="deleteExpense(${exp.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function showSection(sectionId) {
    document.getElementById('expenses-section').style.display = 'none';
    document.getElementById('budget-section').style.display = 'none';
    document.getElementById('categories-section').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// Navigation event listeners
document.getElementById('nav-expenses').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('expenses-section');
    fetchExpenses();
});
document.getElementById('nav-budget').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('budget-section');
    // fetchBudget(); // if you have a function for budget
});
document.getElementById('nav-categories').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('categories-section');
    // fetchCategories(); // if you have a function for categories
});

// Show expenses section by default on page load
showSection('expenses-section');
fetchExpenses();

document.addEventListener('DOMContentLoaded', function() {
    fetchExpenses();
});

function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(result => {
        if (result.message === 'Expense deleted') {
            fetchExpenses(); // Refresh table
        } else {
            alert('Failed to delete expense: ' + (result.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Delete failed:', err);
        alert('An error occurred while deleting the expense.');
    });
}
