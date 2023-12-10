const express = require('express');
const router = express.Router();
const { db } = require('./index');

// HealthCheck endpoint
router.post('/checkHealth', (req, res) => {
  const symptoms = req.body.symptoms || [];
  // Check if symptoms is an array and is not empty
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  } else {
    res.json({
      suggestedConditions: ['Cold', 'Flu'],
      inputSymptoms: symptoms,
    });
  }
});

// Get all health checks from the database
router.get('/healthChecks', (req, res) => {
  db.all('SELECT * FROM health_checks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
