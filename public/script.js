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

async function fetchConditionDetails(symptoms) {
    const apiUrl = 'http://localhost:3000/login';

    const response = await fetch(apiUrl, {
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
        suggestedConditions: data.suggestedConditions,
        inputSymptoms: symptoms,
    };
}

function myFunction1() {
    console.log("Function called");
    var navbar = document.getElementById("navbar");
    var isNavbarResponsive = navbar.classList.contains("responsive");

    if (!isNavbarResponsive) {
        navbar.classList.add("responsive");
        document.addEventListener("click", closeNavbarOnClickOutside);
    } else {
        navbar.classList.remove("responsive");
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}

function closeNavbarOnClickOutside(event) {
    var navbar = document.getElementById("navbar");
    var icon = document.getElementById("navbarButton");

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.className = "navbar";
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}