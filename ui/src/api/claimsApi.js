const BASE_URL = '/api';

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

export const claimsApi = {
  createClaim(payload) {
    return request('/v1/claim/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  getClaim(claimId) {
    return request(`/v1/claim/${claimId}`);
  },

  deleteClaim(claimId) {
    return request(`/v1/claim/${claimId}`, {
      method: 'DELETE',
    });
  },

  editClaim(claimId, payload) {
    return request(`/v1/claim/${claimId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
};
