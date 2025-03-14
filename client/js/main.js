const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const regUsername = document.getElementById('regUsername');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const registerBtn = document.getElementById('registerBtn');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

loginToggle.addEventListener('change', () => {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
});

registerToggle.addEventListener('change', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
})


// Register Function
registerBtn.addEventListener('click', async () => {
    const username = regUsername.value;
    const email = regEmail.value;
    const password = regPassword.value;

    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        alert(data.message);
    } catch (err) {
        alert('Registration failed. Please try again.');
        console.error(err);
    }
});

// Login Function
loginBtn.addEventListener('click', async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.token) {

            // Save the token in localStorage
            localStorage.setItem('token', data.token);
            alert('Login successful');
            window.location.href= '/dashboard.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        alert('Login failed. Please try again.');
        console.error(err);
    }
});