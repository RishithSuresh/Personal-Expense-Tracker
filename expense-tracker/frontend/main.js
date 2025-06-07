// frontend/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    loadIncomeExpenditureData();
});

function loadIncomeExpenditureData() {
    fetch('/api/income-expenditure')
        .then(response => response.json())
        .then(data => {
            displayIncomeExpenditureCharts(data);
        })
        .catch(error => console.error('Error fetching income and expenditure data:', error));
}

function displayIncomeExpenditureCharts(data) {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    const incomeExpenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenditure'],
            datasets: [{
                data: [1200, 800], // Example data
                backgroundColor: ['#4caf50', '#f44336'],
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#2d3a4b',
                        font: { size: 16 }
                    }
                }
            },
            animation: {
                animateScale: true
            }
        }
    });
}

function addExpense() {
    const expenseData = {
        description: document.getElementById('expenseDescription').value,
        amount: document.getElementById('expenseAmount').value,
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value
    };

    fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Expense added successfully!');
        loadIncomeExpenditureData();
    })
    .catch(error => console.error('Error adding expense:', error));
}