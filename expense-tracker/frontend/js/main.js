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
    const ctx = document.getElementById('incomeExpenditureChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenditure'],
            datasets: [{
                label: 'Amount',
                data: [data.income, data.expenditure],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderColor: ['#4CAF50', '#F44336'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
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