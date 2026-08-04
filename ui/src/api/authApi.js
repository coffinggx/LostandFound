const BASE_URL = 'https://lostandfound-2zsq.onrender.com/api';

function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const payload = await parseResponse(response).catch(() => ({}));
    const errorMessage = typeof payload === 'object' ? payload.detail || 'Request failed.' : payload;
    throw new Error(errorMessage);
  }

  return parseResponse(response);
}

export const authApi = {
  login(username, password) {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);

    return request('/v1/user/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  },

  register(payload) {
    return request('/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  getCurrentUser(token) {
    return request('/v1/user/getme', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
