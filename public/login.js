// public/login.js
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    // Save the registered user to local storage
    localStorage.setItem('registeredUser', JSON.stringify({ username, password }));
    // Show the login form and hide the registration form
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
  });
  
document.addEventListener('DOMContentLoaded', function () {
    // Register form handling
    const registerForm = document.getElementById('registerForm');
  
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;
  
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        })
        .catch(error => {
          console.error('Registration Error:', error.message);
        });
    });
  });
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // If login is successful, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // If login is not successful, show an error message
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Login Error:', error.message);
    });
  