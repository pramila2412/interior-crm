const https = require('https');

const data = JSON.stringify({
  email: 'bad@email.com',
  password: 'bad'
});

const options = {
  hostname: 'interior-crm-g0k5.onrender.com',
  port: 443,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
