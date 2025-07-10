// Frontend example
fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'request_id': '1234567'
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'password123'
    })
  })
  .then(response => response.json())
  .then(data => console.log(data));