const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bcrypt = require('bcrypt');
const swaggerDocument = require('./swagger.json');
const crypto = require('crypto');
require('./enhancer');
const apiRoutes = require('./api');
const db = require('./db');
const { error } = require('console');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS health_checks (id INTEGER, symptoms TEXT, conditions TEXT, time NUMERIC)');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS feedback (id INTEGER,username TEXT, message TEXT)');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS conditions (id INTEGER, name TEXT, description TEXT)');
});

const secret = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.get('SELECT id, username, password FROM users WHERE username = ?', [username], function(err, row) {
      if (err) {
        return done(err);
      }

      if (!row) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, row.password, function(err, isMatch) {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, row);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return done(err);
    }

    if (!row) {
      return done(null, false);
    }

    return done(null, { id: row.id, username: row.username });
  });
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (row) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Registration successful' });
      });
    });
  });
});


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/login.js', (req, res) => {
  res.sendFile(__dirname + '/public/login.js');
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.status(401).json({ success: false, message: 'Invalid username or password' }); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.json({ success: true , message: 'Login successful' });
    });
  })(req, res, next);
});

app.get('/checkLoginStatus', (req, res) => {
  const isAuthenticated = req.isAuthenticated();

  res.json({ loggedIn: isAuthenticated });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.get('/secureRoute', ensureAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.user.username}! This is a secure route. <a href="/logout">Logout</a>`);
});

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/checkHealth', (req, res) => {
  res.send('This is the /checkHealth endpoint');
});

app.post('/checkHealth', (req, res) => {
  const userId = req.user.id;
  const symptoms = req.body.symptoms || [];
  const currentTime = new Date().toISOString();

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const suggestedConditions = getEnhancedSuggestions(symptoms);
  const conditions = suggestedConditions.join(', ');

  try {
    db.run('INSERT INTO health_checks (id, symptoms, conditions, time) VALUES (?, ?, ?, ?)', [userId, symptoms.join(', '), conditions, currentTime]);

    res.json({
      suggestedConditions: conditions,
      inputSymptoms: symptoms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while storing the health check data' });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiRoutes);

app.use(express.static('public'));

app.get('/healthChecks', (req, res) => {
  if (!req.user) {
    alert('User not authenticated');
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const userId = req.user.id;

  db.all('SELECT * FROM health_checks WHERE id = ?', [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = { id: row.id, username: row.username, email: row.email };
      res.json(user);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/changePassword', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }   
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';

    await db.run(updateQuery, [hashedPassword, currentUser.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** 
 * Enhances the given symptoms and returns an array of enhanced suggestions.
 * @param {string[]} symptoms - The array of symptoms to be enhanced.
 * @returns {string[]} - The array of enhanced suggestions.
 */
function getEnhancedSuggestions(symptoms) {
  const enhancedSuggestions = symptoms.map(symptom => {
      let enhancedSymptom = symptom;

      if (symptom.includes('headache')) {
          enhancedSymptom = `You havc Intense ${symptom}`;
      } else if (symptom.includes('nausea')) {
          enhancedSymptom = `Persistent ${symptom}`;
      } else {
          enhancedSymptom = `Mild ${symptom} visit a doctor for further diagnosis.`;
      }
      return enhancedSymptom;
  });
  return enhancedSuggestions;
}

module.exports = { getEnhancedSuggestions };

app.get('/conditions/:conditionId', (req, res) => {
  const conditionId = req.params.conditionId;

  const conditionDetails = getConditionDetails(conditionId);

  if (conditionDetails) {
    res.json({ conditionId, conditionDetails });
  } else {
    res.status(404).json({ error: 'Condition not found' });
  }
});

app.get('/api/recentHealthChecks', (req, res) => {
  const userId = req.user.id;

  const selectQuery = 'SELECT * FROM health_checks WHERE id = ? ORDER BY time DESC LIMIT 5';

  db.all(selectQuery, [userId], (error, rows) => {
    if (error) {
      console.error('Error retrieving recent health checks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/submitHealthCheck', (req, res) => {
  const userId = req.user.id;
  const symptoms = req.body.symptoms || [];
  const currentTime = new Date().toISOString();

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const suggestedConditions = getEnhancedSuggestions(symptoms);
  const conditions = suggestedConditions.join(', ');

  const insertQuery = 'INSERT INTO health_checks (id, symptoms, conditions, time) VALUES (?, ?, ?, ?)';
  db.run(insertQuery, [userId, symptoms.join(', '), conditions, currentTime],(error) => {
    if (error) {
      console.error('Error storing health check:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Health check submitted successfully' });
    }
  });
});

app.post('/api/submitFeedback', (req, res) => {
  const { feedback } = req.body;
  const userId = req.user.id;
  const username = req.user.username;
  
  const query = 'INSERT INTO feedback (id, username, message) VALUES (?, ?, ?)';

  db.run(query, [userId,username,feedback], (err) => {
    if (err) {
      console.error('Error storing feedback:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Feedback submitted successfully' });
    }
  });
});

app.get('/conditions/:conditionId', (req, res) => {
  const conditionId = req.params.conditionId;

  const conditionDetails = getConditionDetails(conditionId);

  if (conditionDetails) {
    res.json({ conditionId, conditionDetails });
  } else {
    res.status(404).json({ error: 'Condition not found' });
  }
});

function getConditionDetails(conditionId) {
  let db = new sqlite3.Database('./db/healthcare.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the healthcare database.');
  });

  db.serialize(() => {
    db.each(`SELECT * FROM conditions WHERE id = ?`, [conditionId], (err, row) => {
      if (err) {
        console.error(err.message);
      }
      return row;
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, server};
