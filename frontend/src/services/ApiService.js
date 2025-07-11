import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
if (!API_URL) {
  throw new Error('VITE_BACKEND_URL is not defined. Please set it in your .env file.');
}


const axiosService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  USER AUTHENTICATION

export async function register(firstName, lastName, email, password) {
  try {
    return await axiosService.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  }
  catch (error) {
    if (error.response) {
      throw new Error('Error during registration: ' + error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function login(email, password) {
  try {
    return await axiosService.post('/auth/login', {
      email,
      password,
    });
  }
  catch (error) {
    if (error.response) {
      throw new Error('Error during login: ' + error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

//  USER PROFILE

export async function getUserProfile(token) {
  try {
    const response = await axiosService.get(`/profile`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function getUserPurchases(token) {
  try {
    const response = await axiosService.get(`/purchases`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching user purchases:', error);
    return null;
  }
}

export async function getUserFavorites(token) {
  try {
    const response = await axiosService.get(`/favorites`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching user favorites:', error);
    return null;
  }
}

export async function postNewPurchase(token, items) {
  try {
    const response = await axiosService.post(`/purchases`, {items}, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function putFavoriteProduct(token, productId) {
  try {
    const response = await axiosService.put(`/favorites`, { productId }, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error('Error toggling favorite:', error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function postComment(token, productId, comment) {
  try {
    const response = await axiosService.post(`/products/${productId}/comments`, { comment }, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error posting new comment:', error);
    return null;
  }
}

export async function postReview(token, productId, rating, review) {
  try {
    const response = await axiosService.post(`/products/${productId}/reviews`, { rating, review }, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error('Error posting new review:', error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function userBoughtProduct(token, productId) {
  try {
    const response = await axiosService.get(`/purchases/${productId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}


//  PRODUCTS

export async function getProductById(productId) {
  try {
    const response = await axiosService.get(`/products/${productId}`);
    return response.data;
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchProducts(q, offset = 0, limit = 10) {
  try {
    const response = await axiosService.get(`/products/search`, {
      params: { q, offset, limit },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function getProductsComments(productId) {
  try {
    const response = await axiosService.get(`/products/${productId}/comments`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching product comments:', error);
    return null;
  }
}

export async function getProductsReviews(productId) {
  try {
    const response = await axiosService.get(`/products/${productId}/reviews`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching product reviews:', error);
    return null;
  }
}


export async function adminGetUsers(token) {
  try {
    const response = await axiosService.get(`/admin/users`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(`Error fetching users: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function adminGetUserData(token, userId) {
  try {
    const response = await axiosService.get(`/admin/users/${userId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(`Error fetching user data: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function adminGetTopPurchased(token) {
  try {
    const response = await axiosService.get(`/admin/top/purchased`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(`Error fetching top products: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function adminGetTopFavorites(token) {
  try {
    const response = await axiosService.get(`/admin/top/favorites`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(`Error fetching top products: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function adminGetTopBuyers(token) {
  try {
    const response = await axiosService.get(`/admin/top/buyers`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      throw new Error(`Error fetching top buyers: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error('Error de conexión. Por favor, intente más tarde.');
  }
}

export async function hasAdminAccess(token) {
  try {
    await axiosService.get(`/admin`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return true;
  }
  catch (error) {
    return false;
  }
}
