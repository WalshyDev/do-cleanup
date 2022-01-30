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
  if (!res.ok || !json.success) {
    if (json.error) {
      error(json.error);
    } else {
      error(json.errors[0]);
    }
    return;
  }

  info('');

  const table = document.getElementById('do-table');

  for (const durableObject of json.result) {
    const tr = document.createElement('tr');
    
    const classTd = document.createElement('td');
    classTd.innerText = durableObject.class;
  
    const nameTd = document.createElement('td');
    nameTd.innerText = durableObject.name;

    const scriptTd = document.createElement('td');
    scriptTd.innerText = durableObject.script;

    const idTd = document.createElement('td');
    idTd.innerText = durableObject.id;

    const actionTd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.id = durableObject.id;
    deleteButton.addEventListener('click', deleteDurableObject);
    actionTd.appendChild(deleteButton);

    tr.appendChild(classTd);
    tr.appendChild(nameTd);
    tr.appendChild(scriptTd);
    tr.appendChild(idTd);
    tr.appendChild(actionTd);

    table.appendChild(tr);
  }
});

async function deleteDurableObject(e) {
  const target = e.target;

  if (target.className !== 'delete') {
    target.className = 'delete';
    target.innerText = 'Confirm?';
    return;
  }

  const accountEmail = document.getElementById('accountEmail').value;
  const accountKey = document.getElementById('accountKey').value;
  const accountId = document.getElementById('accountId').value;
  const namespace = target.id;

  if (!accountEmail || !accountKey || !accountId) {
    error('Please enter your account email, key, and account ID');
    return;
  }

  info(`Deleting DO - ${namespace}`);

  const res = await fetch('/durable-objects', {
    method: 'DELETE',
    headers: {
      'X-Auth-Email': accountEmail,
      'X-Auth-Key': accountKey,
      'X-Account-Id': accountId,
      'X-Namespace': namespace,
    }
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    if (json.error) {
      error(json.error);
    } else if (json.cfError) {
      error(json.cfError);
    } else {
      error(json.errors[0]);
    }
    return;
  }

  info('Deleted!');

  target.remove();
}

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