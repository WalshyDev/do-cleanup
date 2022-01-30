document.getElementById('fetch').addEventListener('click', async () => {
  const accountEmail = document.getElementById('accountEmail').value;
  const accountKey = document.getElementById('accountKey').value;
  const accountId = document.getElementById('accountId').value;

  if (!accountEmail || !accountKey || !accountId) {
    error('Please enter your account email, key, and account ID');
    return;
  }

  info('Fetching...');

  const res = await fetch('/durable-objects', {
    headers: {
      'X-Auth-Email': accountEmail,
      'X-Auth-Key': accountKey,
      'X-Account-Id': accountId,
    }
  });

  const json = await res.json();
  if (!res.ok) {
    error(json.error);
    return;
  }

  console.log(json);
});

function error(msg) {
  const element = document.getElementById('message');
  element.className = 'error';
  element.innerText = msg;
}

function info(msg) {
  const element = document.getElementById('message');
  element.className = '';
  element.innerText = msg;
}