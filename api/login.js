document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await res.json();
  const errorDiv = document.getElementById('error');

  if (res.ok) {
    // Now fetch the username to redirect!
    const usernameRes = await fetch(`/api/get-username?email=${encodeURIComponent(email)}`);
    const usernameData = await usernameRes.json();

    if (usernameRes.ok) {
      window.location.href = `/users/${usernameData.username}.html`;
    } else {
      errorDiv.innerText = 'Login succeeded, but failed to find your profile!';
    }
  } else {
    errorDiv.innerText = `Login failed: ${result.error}`;
  }
});
