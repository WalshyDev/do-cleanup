export function onRequestOptions() {
  return new Response(undefined, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://do-cleanup.walshy.dev',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Auth-Email, X-Auth-Key, X-Account-Id, X-Namespace',
    },
  })
}

// GET is for getting DOs
export async function onRequestGet(ctx) {
  const { request } = ctx;
  const accountId = request.headers.get('x-account-id');
  const authEmail = request.headers.get('x-auth-email');
  const authKey = request.headers.get('x-auth-key');

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/durable_objects/namespaces`, {
    method: 'GET',
    headers: {
      'X-Auth-Email': authEmail,
      'X-Auth-Key': authKey,
    },
  });

  if (res.ok) {
    return new Response(JSON.stringify(await res.json()), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to get DOs from CF API - ' + res.status }), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST is for deleting DOs
export async function onRequestDelete(ctx) {
  const { request } = ctx;
  const accountId = request.headers.get('x-account-id');
  const authEmail = request.headers.get('x-auth-email');
  const authKey = request.headers.get('x-auth-key');
  const namespace = request.headers.get('x-namespace');

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/durable_objects/namespaces/${namespace}" `, {
    method: 'DELETE',
    headers: {
      'X-Auth-Email': authEmail,
      'X-Auth-Key': authKey,
    },
  });

  if (res.ok) {
    return new Response(undefined);
  } else {
    const json = await res.json();

    return new Response(JSON.stringify({
      error: 'Failed to delete DO from CF API - ' + res.status,
      cfError: json.errors.length > 0 ? json.errors[0] : '',
    }), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}