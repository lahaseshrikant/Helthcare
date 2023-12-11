// public/script.js

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
// public/script.js

async function getHealthChecks() {
    const healthCheckList = document.getElementById('healthCheckList');

    try {
        const response = await fetch('http://localhost:3000/healthChecks');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Clear the previous list
        healthCheckList.innerHTML = '';

        // Display the health checks
        data.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `Symptoms: ${entry.symptoms}, Conditions: ${entry.conditions}`;
            healthCheckList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error.message);
        // Handle the error, e.g., display a message to the user
    }
}

// Attach the event listener to the form
window.onload = function () {
    // Attach the event listener to the form
    document.getElementById('healthCheckForm')
    console.log(document.getElementById('healthCheckForm'))
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const symptomsInput = document.getElementById('symptoms');
        const symptoms = symptomsInput.value.split(',').map(symptom => symptom.trim());

        // You can add your symptom validation logic here

        document.getElementById('result').innerHTML = `Thank you ${name}, your form has been submitted.`;
    });
}

function fetchConditionDetails(symptoms) {
    const apiUrl = 'http://localhost:3000/checkHealth';
  
    console.log('Request Payload:', { symptoms }); // Log the request payload
  
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        return {
          suggestedConditions: data.suggestedConditions || [],
          inputSymptoms: symptoms,
        };
      });
  }
  

