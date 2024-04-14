document.addEventListener('DOMContentLoaded', checkLoginStatus);
document.getElementById('healthCheckForm').addEventListener('submit', submitForm);

async function checkLoginStatus() {
    try {
        const response = await fetch('/checkLoginStatus');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const loginStatus = await response.json();
        adjustUIBasedOnLoginStatus(loginStatus);
    } catch (error) {
        console.error('Error checking login status:', error.message);
    }
}

function adjustUIBasedOnLoginStatus(loginStatus) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const dashboardLink = document.getElementById('dashboardLink');

    if (loginStatus.loggedIn) {
        if (loginLink) loginLink.classList.remove('visible');
        if (logoutLink) logoutLink.classList.add('visible');
        if (dashboardLink) dashboardLink.classList.add('visible');
    } else {
        if (loginLink) loginLink.classList.add('visible');
        if (logoutLink) logoutLink.classList.remove('visible');
        if (dashboardLink) dashboardLink.classList.remove('visible');
    }
}

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const symptomsInput = document.getElementById('symptoms');
    const symptoms = symptomsInput.value.split(',').map(symptom => symptom.trim());

    if (symptoms.some(symptom => symptom === '')) {
        alert('Please enter valid symptoms separated by commas.');
        return;
    }

    fetchConditionDetails(symptoms)
        .then(details => updatePageWithConditionDetails(details, name))
        .catch(error => {
            console.error('Failed to fetch condition details:', error);
            alert('Failed to fetch condition details. Please try again later.');
        });
}

async function fetchConditionDetails(symptoms) {
    const apiUrl = 'http://localhost:3000/checkHealth';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return {
        suggestedConditions: data.suggestedConditions || [],
        inputSymptoms: symptoms,
    };
}

function updatePageWithConditionDetails(details, name) {
    const resultDiv = document.getElementById('result');

    if (resultDiv && Array.isArray(details.suggestedConditions)) {
        resultDiv.innerHTML = `<p>Suggested Conditions: ${details.suggestedConditions.join(', ')}</p>`;
        resultDiv.innerHTML += `Thank you ${name}, your form has been submitted.`;
    }
}

fetch('http://localhost:3000/healthChecks')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(healthChecks => {
        console.log(healthChecks);

        const healthCheckList = document.getElementById('healthCheckList');

        healthChecks.forEach(healthCheck => {
            const li = document.createElement('li');
            li.textContent = `Symptoms: ${healthCheck.symptoms}, Conditions: ${healthCheck.conditions}`;
            healthCheckList.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));

async function checkHealth() {
    const symptomsInput = document.getElementById('symptoms');
    const resultDiv = document.getElementById('result');

    const symptoms = symptomsInput.value.split(',').map(symptom => symptom.trim());

    try {
        const response = await fetch('http://localhost:3000/checkHealth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.suggestedConditions)) {
            resultDiv.innerHTML = `<p>Suggested Health Conditions: ${data.suggestedConditions.join(', ')}</p>`;
        } else {
            resultDiv.innerHTML = '<p>No suggested conditions found.</p>';
        }
    } catch (error) {
        console.error('Error:', error.message);
        resultDiv.innerHTML = '<p>An error occurred. Please try again.</p>';
    }
}

async function getHealthChecks() {
    const healthCheckList = document.getElementById('healthCheckList');

    try {
        const response = await fetch('http://localhost:3000/healthChecks');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        healthCheckList.innerHTML = '';

        data.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `Symptoms: ${entry.symptoms}, Conditions: ${entry.conditions}`;
            healthCheckList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

window.onload = function () {
    document.getElementById('healthCheckForm')
    console.log(document.getElementById('healthCheckForm'))
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const symptomsInput = document.getElementById('symptoms');
        const symptoms = symptomsInput.value.split(',').map(symptom => symptom.trim());

        document.getElementById('result').innerHTML = `Thank you ${name}, your form has been submitted.`;
    });
}

async function fetchConditionDetails(symptoms) {
    const response = await fetch('http://localhost:3000/checkHealth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
        suggestedConditions: data.suggestedConditions || [],
        inputSymptoms: symptoms,
    };
}