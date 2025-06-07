// frontend/js/budget.js

document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budget-form');
    const budgetDisplay = document.getElementById('budget-display');

    // Fetch and display the current budget
    fetchBudget();

    // Event listener for budget form submission
    budgetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const budgetAmount = document.getElementById('budget-amount').value;
        setBudget(budgetAmount);
    });

    function fetchBudget() {
        fetch('/api/budget')
            .then(response => response.json())
            .then(data => {
                budgetDisplay.textContent = `Current Budget: $${data.amount}`;
            })
            .catch(error => console.error('Error fetching budget:', error));
    }

    function setBudget(amount) {
        fetch('/api/budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        })
        .then(response => response.json())
        .then(data => {
            alert('Budget updated successfully!');
            fetchBudget();
        })
        .catch(error => console.error('Error setting budget:', error));
    }
});