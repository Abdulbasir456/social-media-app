const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// Register Function
registerBtn.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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