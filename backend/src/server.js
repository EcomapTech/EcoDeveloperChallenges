const express = require('express');
const cors = require('cors'); // Import the 'cors' package

const bodyParser = require('body-parser');
const { searchSimilarWords, addWord, removeSimilarWord } = require('./searchEngine');

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Search API endpoint
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.query;
    const similarWords = searchSimilarWords(query.toLowerCase());
    res.json({ results: similarWords });
  } catch (error) {
    console.error('Error searching for similar words:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });

  }
});

// Add API endpoint
app.post('/api/add', (req, res) => {
  try {
    const newWord = req.body.word.toLowerCase();
    addWord(newWord);
    res.json({ message: 'Word added successfully.' });
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Remove API endpoint
app.delete('/api/remove', (req, res) => {
  try {
    const wordToRemove = req.body.word.toLowerCase();
    removeSimilarWord(wordToRemove);
    res.json({ message: 'Word removed successfully.' });
  } catch (error) {
    console.error('Error removing word:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
