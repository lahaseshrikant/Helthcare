document.getElementById('registerLink').addEventListener('click', function(event) {
  event.preventDefault();

  document.getElementById('registerFormContainer').style.display = 'block';

  document.getElementById('loginFormContainer').style.display = 'none';
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const email = document.getElementById('registerEmail').value;

  registeredUsers.push({ username: username, password: password, email: email });

  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
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
    const email = document.getElementById('registerEmail').value;

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Registration Error:', error.message);
      });
  });

  // Login form handling
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          window.location.href = '/dashboard';
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Login Error:', error.message);
      });
  });
});