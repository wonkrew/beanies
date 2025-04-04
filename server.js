const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;
const dataDir = process.env.DATA_DIR || './';
const dogFilePath = path.join(dataDir, 'dog.json');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for simplicity (enable in production with proper config)
}));

// Enable compression
app.use(compression());

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow any domain in production
    : ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Serve static files from current directory
app.use(express.static('./'));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Ensure dog.json exists before server starts
async function ensureDogFileExists() {
  try {
    await fs.access(dogFilePath);
    console.log(`Using dog database at: ${dogFilePath}`);
  } catch (error) {
    console.log('dog.json not found, creating empty database');
    await fs.writeFile(dogFilePath, JSON.stringify([], null, 4));
  }
}

// Get all dogs
app.get('/api/dogs', async (req, res, next) => {
    try {
        const data = await fs.readFile(dogFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading dogs file:', error);
        next(error);
    }
});

// Get a specific dog by breed
app.get('/api/dogs/:breed', async (req, res, next) => {
    try {
        const breedName = req.params.breed;
        const data = await fs.readFile(dogFilePath, 'utf8');
        const dogs = JSON.parse(data);
        
        const dog = dogs.find(d => d.breed === breedName);
        if (!dog) {
            return res.status(404).json({ error: 'Dog breed not found' });
        }
        
        res.json(dog);
    } catch (error) {
        console.error('Error reading dog breed:', error);
        next(error);
    }
});

// Update dogs data (add, edit, or delete)
app.post('/api/dogs', async (req, res, next) => {
    try {
        const updatedDogs = req.body;
        await fs.writeFile(dogFilePath, JSON.stringify(updatedDogs, null, 4));
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing dogs file:', error);
        next(error);
    }
});

// Delete a specific dog by breed
app.delete('/api/dogs/:breed', async (req, res, next) => {
    try {
        const breedToDelete = req.params.breed;
        const data = await fs.readFile(dogFilePath, 'utf8');
        let dogs = JSON.parse(data);
        
        const initialCount = dogs.length;
        dogs = dogs.filter(d => d.breed !== breedToDelete);
        
        if (dogs.length === initialCount) {
            return res.status(404).json({ error: 'Dog breed not found' });
        }
        
        await fs.writeFile(dogFilePath, JSON.stringify(dogs, null, 4));
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting dog breed:', error);
        next(error);
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong' });
});

// Start server after ensuring dog.json exists
async function startServer() {
    try {
        await ensureDogFileExists();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Access the app at: http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer(); 