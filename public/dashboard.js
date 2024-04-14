
document.addEventListener('DOMContentLoaded', () => {
  fetchUserData();
  fetchRecentHealthChecks();

  document.getElementById('settingsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    changePassword();
  });
  document.getElementById('feedbackForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitFeedback();
  });

  document.getElementById('healthCheckForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitHealthCheck();
  });
  checkLoginStatus();
});

async function checkLoginStatus() {
  try {
    const response = await fetch('/checkLoginStatus');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const loginStatus = await response.json();
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    if (loginStatus.loggedIn) {
      if (loginLink) loginLink.classList.remove('visible');
      if (logoutLink) logoutLink.classList.add('visible');
    } else {
      if (loginLink) loginLink.classList.add('visible');
      if (logoutLink) logoutLink.classList.remove('visible');
    }
  } catch (error) {
    console.error('Error checking login status:', error.message);
  }
}

async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();
    document.getElementById('username').innerText = userData.username;
    document.getElementById('email').innerText = userData.email;
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
      body: JSON.stringify({ newPassword: newPassword }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message) {
        console.log(data.message);

        const changePasswordMessage = document.getElementById('changePasswordMessage');
        if (changePasswordMessage) {
          changePasswordMessage.textContent = data.message;
        } else {
          console.error('Element with id "changePasswordMessage" not found');
        }
      } else {
        console.error('Unexpected response format:', data);
      }
    } else {
      if (response.status === 401) {
        console.error('Unauthorized: User not logged in');
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error('Error changing password:', error.message);
  }
}


async function fetchRecentHealthChecks() {
  try {
    const response = await fetch('/api/recentHealthChecks');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const healthChecks = await response.json();
    const healthCheckList = document.getElementById('healthCheckList');
    healthCheckList.innerHTML = '';

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