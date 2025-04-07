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
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.left = '50%';
    successDiv.style.transform = 'translateX(-50%)';
    successDiv.style.padding = '12px 24px';
    successDiv.style.backgroundColor = '#4CAF50';
    successDiv.style.color = 'white';
    successDiv.style.borderRadius = '5px';
    successDiv.style.zIndex = '1000';
    successDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    successDiv.style.transition = 'opacity 0.5s, transform 0.5s';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(-50%) translateY(-20px)';
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
async function deleteDogBreed(breedName) {
    if (!confirm(`Are you sure you want to delete ${breedName}?`)) {
        return;
    }
    
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs/${encodeURIComponent(breedName)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete dog breed');
        }
        
        // Show success message
        showSuccessMessage(`${breedName} has been deleted successfully!`);
        
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

// Function to add resource inputs (title + URL)
function addResourceInput() {
    const container = document.getElementById('additionalResourcesInputs');
    const newGroup = document.createElement('div');
    newGroup.className = 'array-input-group';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'resource-title-item';
    titleInput.placeholder = 'Resource Title';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'resource-url-item';
    urlInput.placeholder = 'Resource URL';
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '-';
    removeBtn.onclick = function() {
        container.removeChild(newGroup);
    };
    
    newGroup.appendChild(titleInput);
    newGroup.appendChild(urlInput);
    newGroup.appendChild(removeBtn);
    container.appendChild(newGroup);
}

// Form submission handler
document.getElementById('dogBreedForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button and show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    
    try {
        // Create new dog object with the updated form structure
        const newDog = {
            breedName: document.getElementById('breedName').value,
            breedAbout: document.getElementById('breedAbout').value,
            groupClassification: document.getElementById('groupClassification').value,
            image_url: document.getElementById('image_url').value,
            originAndHistory: {
                countryOfOrigin: document.getElementById('countryOfOrigin').value,
                historicalDevelopment: document.getElementById('historicalDevelopment').value,
                bredFor: document.getElementById('bredFor').value
            },
            physicalCharacteristics: {
                size: {
                    height: document.getElementById('height').value,
                    weight: document.getElementById('weight').value
                },
                distinctiveFeatures: Array.from(document.querySelectorAll('.distinctive-feature-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== '')
            },
            temperament: {
                personalityTraits: Array.from(document.querySelectorAll('.personality-trait-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== ''),
                goodWithFamilies: document.getElementById('goodWithFamilies').value === 'true',
                goodWithChildren: document.getElementById('goodWithChildren').value === 'true',
                goodWithOtherPets: document.getElementById('goodWithOtherPets').value
            },
            exerciseNeeds: {
                dailyExerciseTime: document.getElementById('dailyExerciseTime').value,
                recommendedActivities: Array.from(document.querySelectorAll('.recommended-activity-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== '')
            },
            groomingRequirements: {
                coatMaintenance: document.getElementById('coatMaintenance').value,
                sheddingLevel: document.getElementById('sheddingLevel').value,
                professionalGroomingRecommended: document.getElementById('professionalGroomingRecommended').value === 'true'
            },
            healthConsiderations: {
                commonHealthIssues: Array.from(document.querySelectorAll('.health-issue-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== ''),
                averageLifespan: document.getElementById('averageLifespan').value
            },
            trainingAndIntelligence: {
                trainability: parseInt(document.getElementById('trainability').value) || 0,
                intelligenceLevel: parseInt(document.getElementById('intelligenceLevel').value) || 0,
                trainingChallenges: Array.from(document.querySelectorAll('.training-challenge-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== ''),
                recommendedTrainingMethods: Array.from(document.querySelectorAll('.training-method-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== '')
            },
            livingEnvironment: {
                suitableForApartment: parseInt(document.getElementById('suitableForApartment').value) || 0,
                suitableForHouseWithYard: document.getElementById('suitableForHouseWithYard').value === 'true',
                climateAdaptability: parseInt(document.getElementById('climateAdaptability').value) || 0
            },
            recognitionAndStandards: {
                recognizedBy: Array.from(document.querySelectorAll('.recognized-by-item'))
                    .map(input => input.value)
                    .filter(value => value.trim() !== ''),
                officialStandardLinks: {
                    AKC: document.getElementById('officialStandardLink').value
                }
            },
            additionalResources: Array.from(document.querySelectorAll('.resource-title-item'))
                .map((input, index) => {
                    const url = document.querySelectorAll('.resource-url-item')[index].value;
                    return {
                        title: input.value,
                        url: url
                    };
                })
                .filter(resource => resource.title.trim() !== '' && resource.url.trim() !== ''),
            media: {
                imageGallery: [document.getElementById('image_url').value]
            },
            relatedBreeds: Array.from(document.querySelectorAll('.related-breed-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            behavior: Array.from(document.querySelectorAll('.behavior-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            exercise_needs: Array.from(document.querySelectorAll('.exercise-needs-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            grooming: Array.from(document.querySelectorAll('.grooming-detail-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            nutrition: Array.from(document.querySelectorAll('.nutrition-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            history: Array.from(document.querySelectorAll('.history-item'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            traits: {
                familyLife: {
                    affectionateWithFamily: parseInt(document.getElementById('affectionateWithFamily').value) || 0,
                    goodWithYoungChildren: parseInt(document.getElementById('goodWithYoungChildren').value) || 0,
                    goodWithOtherDogs: parseInt(document.getElementById('goodWithOtherDogs').value) || 0
                },
                physical: {
                    coatGroomingFrequency: parseInt(document.getElementById('coatGroomingFrequency').value) || 0,
                    coatLength: document.getElementById('coatLength').value,
                    droolingLevel: parseInt(document.getElementById('droolingLevel').value) || 0,
                    sheddingLevel: parseInt(document.getElementById('sheddingLevel').value) || 0,
                    coatTypeAndColor: {
                        coatType: document.getElementById('coatType').value,
                        coatColors: Array.from(document.querySelectorAll('.coat-color-item'))
                            .map(input => input.value)
                            .filter(value => value.trim() !== '')
                    }
                },
                social: {
                    opennessToStrangers: parseInt(document.getElementById('opennessToStrangers').value) || 0,
                    playfulnessLevel: parseInt(document.getElementById('playfulnessLevel').value) || 0,
                    watchdogProtectiveNature: parseInt(document.getElementById('watchdogProtectiveNature').value) || 0,
                    adaptabilityLevel: parseInt(document.getElementById('adaptabilityLevel').value) || 0
                },
                personality: {
                    trainabilityLevel: parseInt(document.getElementById('trainabilityLevel').value) || 0,
                    energyLevel: parseInt(document.getElementById('energyLevel').value) || 0,
                    barkingLevel: parseInt(document.getElementById('barkingLevel').value) || 0,
                    mentalStimulationNeeds: parseInt(document.getElementById('mentalStimulationNeeds').value) || 0
                },
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
        if (!newDog.breedName || !newDog.image_url) {
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
        showSuccessMessage('New dog breed added successfully!');
        
        // Reset form
        this.reset();
        
        // Reset array inputs for all the array-input fields
        [
            'historyInputs', 'behaviorInputs', 'exerciseNeedsInputs', 
            'groomingDetailsInputs', 'nutritionInputs', 'distinctiveFeaturesInputs',
            'personalityTraitsInputs', 'recommendedActivitiesInputs', 
            'commonHealthIssuesInputs', 'trainingChallengesInputs',
            'recommendedTrainingMethodsInputs', 'recognizedByInputs',
            'additionalResourcesInputs', 'relatedBreedsInputs', 'coatColorsInputs'
        ].forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                // Get the class name from the first input in the container
                const firstInput = container.querySelector('input');
                if (firstInput) {
                    const className = firstInput.className;
                    container.innerHTML = `
                        <div class="array-input-group">
                            <input type="text" class="${className}" placeholder="${firstInput.placeholder}">
                        </div>
                    `;
                }
            }
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
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs`);
        if (!response.ok) {
            throw new Error('Failed to load breeds');
        }
        const breeds = await response.json();
        
        // Convert all breeds to the same format
        return breeds.map(breed => {
            // If it's already in the new format
            if (breed.breedName) {
                return breed;
            }
            // If it's in the old format
            else if (breed.breed) {
                return {
                    breedName: breed.breed,
                    image_url: breed.image_url || '',
                    groupClassification: breed.group || 'Not specified',
                    physicalCharacteristics: {
                        size: {
                            height: breed.basic_info?.height || 'Not specified',
                            weight: breed.basic_info?.weight || 'Not specified'
                        }
                    },
                    traits: breed.traits || {}
                };
            }
            // If format is unknown, create a minimal valid object
            else {
                return {
                    breedName: 'Unknown breed',
                    image_url: breed.image_url || '',
                    groupClassification: 'Not specified',
                    physicalCharacteristics: {
                        size: {
                            height: 'Not specified',
                            weight: 'Not specified'
                        }
                    }
                };
            }
        });
    } catch (error) {
        console.error('Error loading breeds:', error);
        throw error;
    }
}

// This function adds a new breed
async function addBreed(newBreed) {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/dogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBreed)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add new breed');
        }
        
        return true;
    } catch (error) {
        console.error('Error adding breed:', error);
        throw error;
    }
} 