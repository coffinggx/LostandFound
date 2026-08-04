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

export const itemsApi = {
  getAllPosts() {
    return request('/v1/item/posts');
  },

  getPostById(postId) {
    return request(`/v1/item/posts/${postId}`);
  },

  createPost(formData) {
    return request('/v1/item/create', {
      method: 'POST',
      body: formData,
    });
  },

  updatePost(postId, formData) {
    return request(`/v1/item/edit/${postId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  deletePost(postId) {
    return request(`/v1/item/delete/${postId}`, {
      method: 'DELETE',
    });
  },

  getClaimsForItem(itemId) {
    return request(`/v1/item/item/${itemId}/claims`);
  },

  getReturnedItems() {
    return request('/v1/item/item/returned');
  },

  markReturned(itemId) {
    return request(`/v1/item/item/${itemId}/returned`, {
      method: 'PATCH',
    });
  },
};
