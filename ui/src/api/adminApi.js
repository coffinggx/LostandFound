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

export const adminApi = {
  getPendingClaims() {
    return request('/v1/admin/claims/pending');
  },

  getPendingItems() {
    return request('/v1/admin/items/pending');
  },

  approveClaim(claimId) {
    return request(`/v1/admin/claims/${claimId}/approve`, {
      method: 'PATCH',
    });
  },

  rejectClaim(claimId) {
    return request(`/v1/admin/claims/${claimId}/reject`, {
      method: 'PATCH',
    });
  },

  approvePost(itemId) {
    return request(`/v1/admin/items/${itemId}/approve`, {
      method: 'PATCH',
    });
  },

  rejectPost(itemId) {
    return request(`/v1/admin/items/${itemId}/reject`, {
      method: 'PATCH',
    });
  },

  getAdminStats() {
    return request('/v1/admin/dashboard');
  },
};
