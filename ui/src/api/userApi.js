const BASE_URL = 'https://lostandfound-2zsq.onrender.com/api';
function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
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
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const payload = await parseResponse(response).catch(() => ({}));
    const errorMessage = typeof payload === 'object' ? payload.detail || 'Request failed.' : payload;
    throw new Error(errorMessage);
  }

  return parseResponse(response);
}

export const userApi = {
  getMyPosts() {
    return request('/v1/user/posts');
  },

  getMyClaims() {
    return request('/v1/user/claims');
  },

  getDashboardStats() {
    return request('/v1/user/dashboard');
  },

  getUserById(userId) {
    return request(`/v1/user/user/${userId}`);
  },
};
