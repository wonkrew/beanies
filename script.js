// Add this function at the top of the file
function getApiBaseUrl() {
    // Check if we're running locally or in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    } else {
        // In production, use relative URLs (assumes frontend and backend deployed together)
        return '';
    }
}

// Function to add new input fields for arrays (history, behavior, etc.)
function addInput(containerId, className) {
    const container = document.getElementById(containerId);
    const newGroup = document.createElement('div');
    newGroup.className = 'array-input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = className;
    input.placeholder = `Enter ${containerId.replace('Inputs', '').toLowerCase()} item`;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => newGroup.remove();
    
    newGroup.appendChild(input);
    newGroup.appendChild(removeBtn);
    container.appendChild(newGroup);
}

// Function to show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => successDiv.remove(), 500);
    }, 3000);
}

// Function to get all input values from array fields
function getArrayInputs(className) {
    return Array.from(document.getElementsByClassName(className))
        .map(input => input.value.trim())
        .filter(value => value !== '');
}

// Function to read the existing dogs data
async function readDogsFile() {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs`);
        if (!response.ok) {
            throw new Error('Failed to read dogs data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error reading dogs file:', error);
        alert('Error reading existing dog data. Please try again.');
        throw error;
    }
}

// Function to save the updated dogs data
async function saveDogs(dogs) {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dogs)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save dogs data');
        }
    } catch (error) {
        console.error('Error saving dogs:', error);
        alert('Error saving dog data. Please try again.');
        throw error;
    }
}

// Function to delete a dog breed
async function deleteDogBreed(breed) {
    if (!confirm(`Are you sure you want to delete ${breed}?`)) {
        return;
    }
    
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs/${encodeURIComponent(breed)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete dog breed');
        }
        
        // Show success message
        showSuccessMessage(`${breed} has been deleted successfully!`);
        
        // Reload the breeds list
        if (typeof loadBreeds === 'function') {
            loadBreeds();
        } else {
            // If loadBreeds is not available, reload the page
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error deleting dog breed:', error);
        alert('Failed to delete dog breed. Please try again.');
    }
}

// Form submission handler
document.getElementById('dogBreedForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button and show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    
    try {
        // Create new dog object
        const newDog = {
            breed: document.getElementById('breed').value,
            image_url: document.getElementById('image_url').value,
            basic_info: {
                lifespan: document.getElementById('lifespan').value,
                height: document.getElementById('height').value,
                weight: document.getElementById('weight').value
            },
            history: getArrayInputs('history-item'),
            behavior: getArrayInputs('behavior-item'),
            exercise_needs: getArrayInputs('exercise-item'),
            grooming: getArrayInputs('grooming-item'),
            nutrition: getArrayInputs('nutrition-item'),
            traits: {
                jogging_partner: parseInt(document.getElementById('jogging_partner').value),
                lap_dog: parseInt(document.getElementById('lap_dog').value),
                good_with_children: parseInt(document.getElementById('good_with_children').value),
                warm_weather: parseInt(document.getElementById('warm_weather').value),
                cold_weather: parseInt(document.getElementById('cold_weather').value),
                grooming_requirements: parseInt(document.getElementById('grooming_requirements').value),
                shedding: parseInt(document.getElementById('shedding').value),
                barking: parseInt(document.getElementById('barking').value),
                ease_of_training: parseInt(document.getElementById('ease_of_training').value)
            }
        };

        // Validate required fields
        if (!newDog.breed || !newDog.image_url || !newDog.basic_info.lifespan || 
            !newDog.basic_info.height || !newDog.basic_info.weight) {
            alert('Please fill in all required fields');
            return;
        }

        // Read existing dogs
        const existingDogs = await readDogsFile();
        
        // Add new dog
        existingDogs.push(newDog);
        
        // Save updated data
        await saveDogs(existingDogs);
        
        // Show success message
        alert('New dog breed added successfully!');
        
        // Reset form
        this.reset();
        
        // Reset array inputs
        ['historyInputs', 'behaviorInputs', 'exerciseInputs', 'groomingInputs', 'nutritionInputs'].forEach(id => {
            const container = document.getElementById(id);
            container.innerHTML = `
                <div class="array-input-group">
                    <input type="text" class="${id.replace('Inputs', '-item')}" placeholder="Enter ${id.replace('Inputs', '').toLowerCase()} item">
                </div>
            `;
        });
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add new dog breed. Please try again.');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});

// This function loads dog breeds from the server
async function loadBreeds() {
    try {
        const response = await fetch('http://localhost:3000/api/dogs');
        // ... existing code ...
    } catch (error) {
        // ... existing code ...
    }
}

// This function adds a new breed
async function addBreed(newBreed) {
    try {
        const response = await fetch('http://localhost:3000/api/dogs', {
            // ... existing code ...
        });
        // ... existing code ...
    } catch (error) {
        // ... existing code ...
    }
} 