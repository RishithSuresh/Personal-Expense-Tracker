// Enhanced Categories Management JavaScript

// API_BASE_URL is defined in main.js

document.addEventListener('DOMContentLoaded', () => {
    initializeCategoriesPage();
});

async function initializeCategoriesPage() {
    await loadCategories();
    setupCategoryEventListeners();
    setupColorPresets();
}

// Load and display categories
async function loadCategories() {
    try {
        console.log('Loading categories from:', `${API_BASE_URL}/categories`);
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        console.log('Categories loaded:', categories);

        const grid = document.getElementById('categories-grid');
        if (!grid) {
            console.error('Categories grid element not found!');
            return;
        }

        grid.innerHTML = '';

        if (!categories || categories.length === 0) {
            grid.innerHTML = '<p class="no-data">No categories found. Create your first category!</p>';
            return;
        }

        categories.forEach(category => {
            const categoryCard = createCategoryCard(category);
            grid.appendChild(categoryCard);
        });
        console.log('Categories displayed successfully');
    } catch (err) {
        console.error('Error loading categories:', err);
        const grid = document.getElementById('categories-grid');
        if (grid) {
            grid.innerHTML = '<p class="no-data error">Error loading categories. Check console for details.</p>';
        }
    }
}

// Create category card element
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-item-card';
    card.style.borderLeft = `4px solid ${category.color || '#ff4c29'}`;
    
    card.innerHTML = `
        <div class="category-header">
            <div class="category-icon" style="background: ${category.color || '#ff4c29'}">
                ${category.icon || '📝'}
            </div>
            <div class="category-info">
                <h4>${category.name}</h4>
                <p class="category-description">${category.description || 'No description'}</p>
            </div>
            <div class="category-actions">
                <button class="edit-category-btn" onclick="editCategory(${category.id})">✏️</button>
                <button class="delete-category-btn" onclick="deleteCategory(${category.id})">🗑️</button>
            </div>
        </div>
        <div class="category-stats">
            <div class="stat">
                <span class="stat-label">Color:</span>
                <div class="color-indicator" style="background: ${category.color || '#ff4c29'}"></div>
            </div>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupCategoryEventListeners() {
    // Show/hide category form
    document.getElementById('show-category-form').addEventListener('click', () => {
        const form = document.getElementById('category-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
    
    // Cancel category form
    document.getElementById('cancel-category').addEventListener('click', () => {
        document.getElementById('category-form').style.display = 'none';
        document.getElementById('category-form').reset();
        document.getElementById('category-color').value = '#ff4c29';
    });
    
    // Handle category form submission
    document.getElementById('category-form').addEventListener('submit', handleCategorySubmission);
}

// Setup color presets
function setupColorPresets() {
    const colorPresets = document.querySelectorAll('.color-preset');
    const colorInput = document.getElementById('category-color');
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            colorInput.value = color;
            
            // Remove active class from all presets
            colorPresets.forEach(p => p.classList.remove('active'));
            // Add active class to clicked preset
            preset.classList.add('active');
        });
    });
}

// Handle category form submission
async function handleCategorySubmission(e) {
    e.preventDefault();
    console.log('Form submitted!');

    const formData = {
        name: document.getElementById('category-name').value.trim(),
        icon: document.getElementById('category-icon').value,
        color: document.getElementById('category-color').value,
        description: document.getElementById('category-description').value.trim()
    };

    console.log('Form data:', formData);

    // Validate required fields
    if (!formData.name) {
        alert('Please enter a category name');
        return;
    }

    if (!formData.icon) {
        alert('Please select an icon');
        return;
    }

    try {
        console.log('Sending request to:', `${API_BASE_URL}/categories`);
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (response.ok) {
            alert('Category created successfully!');
            document.getElementById('category-form').reset();
            document.getElementById('category-form').style.display = 'none';
            document.getElementById('category-color').value = '#ff4c29';
            await loadCategories();
        } else {
            alert('Error: ' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error creating category:', err);
        alert('Network error: ' + err.message);
    }
}

// Edit category function
window.editCategory = async function(id) {
    try {
        // Get current category data
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        const category = categories.find(c => c.id === id);
        
        if (!category) {
            alert('Category not found');
            return;
        }
        
        // Show form with current data
        document.getElementById('category-form').style.display = 'block';
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-icon').value = category.icon || '📝';
        document.getElementById('category-color').value = category.color || '#ff4c29';
        document.getElementById('category-description').value = category.description || '';
        
        // Change form to edit mode
        const form = document.getElementById('category-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Category';
        
        // Remove existing event listener and add new one for update
        form.removeEventListener('submit', handleCategorySubmission);
        form.addEventListener('submit', async function updateHandler(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('category-name').value,
                icon: document.getElementById('category-icon').value,
                color: document.getElementById('category-color').value,
                description: document.getElementById('category-description').value
            };
            
            try {
                const updateResponse = await fetch(`${API_BASE_URL}/categories/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (updateResponse.ok) {
                    form.reset();
                    form.style.display = 'none';
                    submitBtn.textContent = 'Create Category';
                    
                    // Restore original event listener
                    form.removeEventListener('submit', updateHandler);
                    form.addEventListener('submit', handleCategorySubmission);
                    
                    await loadCategories();
                } else {
                    const result = await updateResponse.json();
                    alert('Error: ' + result.error);
                }
            } catch (err) {
                console.error('Error updating category:', err);
                alert('An error occurred while updating the category.');
            }
        });
        
    } catch (err) {
        console.error('Error loading category for edit:', err);
        alert('An error occurred while loading the category.');
    }
};

// Delete category function
window.deleteCategory = async function(id) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCategories();
        } else {
            alert('Error deleting category');
        }
    } catch (err) {
        console.error('Error deleting category:', err);
        alert('An error occurred while deleting the category.');
    }
};
