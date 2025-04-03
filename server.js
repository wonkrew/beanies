const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const dataDir = process.env.DATA_DIR || './';
const dogFilePath = path.join(dataDir, 'dog.json');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from current directory
app.use(express.static('./'));

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// GET endpoint to read dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const data = await fs.readFile(dogFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, return empty array
            res.json([]);
        } else {
            console.error('Error reading file:', error);
            res.status(500).json({ error: 'Failed to read dogs data' });
        }
    }
});

// POST endpoint to save dogs
app.post('/api/dogs', async (req, res) => {
    try {
        const dogs = req.body;
        await fs.writeFile(dogFilePath, JSON.stringify(dogs, null, 2));
        res.json({ message: 'Dogs data saved successfully' });
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Failed to save dogs data' });
    }
});

// DELETE endpoint to remove a dog by breed name
app.delete('/api/dogs/:breed', async (req, res) => {
    try {
        const breedToDelete = decodeURIComponent(req.params.breed);
        const data = await fs.readFile(dogFilePath, 'utf8');
        let dogs = JSON.parse(data);
        
        const initialLength = dogs.length;
        dogs = dogs.filter(dog => dog.breed !== breedToDelete);
        
        if (dogs.length === initialLength) {
            return res.status(404).json({ error: 'Breed not found' });
        }
        
        await fs.writeFile(dogFilePath, JSON.stringify(dogs, null, 2));
        res.json({ message: 'Dog breed deleted successfully' });
    } catch (error) {
        console.error('Error deleting breed:', error);
        res.status(500).json({ error: 'Failed to delete dog breed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 