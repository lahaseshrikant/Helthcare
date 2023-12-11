import fetch from 'node-fetch';
document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display user information
  fetchUserData();
  fetchRecentHealthChecks();

  // Handle settings form submission
  document.getElementById('settingsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitHealthCheck();
    changePassword();
  });
  // Handle feedback form submission
  document.getElementById('feedbackForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitFeedback();
  });
});

async function fetchUserData() {
  try {
    const response = await fetch('/api/user'); // Assume an API endpoint to get user data
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();
    document.getElementById('username').innerText = userData.username;
    document.getElementById('email').innerText = userData.email;
    // Update other profile information as needed
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
}

async function changePassword() {
  const newPassword = document.getElementById('newPassword').value;

  try {
    const response = await fetch('/api/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert('Password changed successfully!');
  } catch (error) {
    console.error('Error changing password:', error.message);
    alert('Failed to change password. Please try again.');
  }
}

async function fetchRecentHealthChecks() {
  try {
    const response = await fetch('/api/recentHealthChecks'); // Assume an API endpoint to get recent health checks
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const healthChecks = await response.json();
    const healthCheckList = document.getElementById('healthCheckList');
    healthCheckList.innerHTML = ''; // Clear previous list

    healthChecks.forEach((healthCheck) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Symptoms: ${healthCheck.symptoms}, Conditions: ${healthCheck.conditions}`;
      healthCheckList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching recent health checks:', error.message);
  }
}

async function submitHealthCheck() {
  const symptoms = document.getElementById('symptoms').value.split(',').map(symptom => symptom.trim());

  try {
    const response = await fetch('/api/submitHealthCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert('Health check submitted successfully!');
    // Fetch and display updated recent health checks
    fetchRecentHealthChecks();
  } catch (error) {
    console.error('Error submitting health check:', error.message);
    alert('Failed to submit health check. Please try again.');
  }
}

async function submitFeedback() {
  const feedback = document.getElementById('feedback').value;

  try {
    const response = await fetch('/api/submitFeedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert('Feedback submitted successfully!');
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    alert('Failed to submit feedback. Please try again.');
  }
}