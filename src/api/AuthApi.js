const API_URL = "http://localhost:8080/api/v1/auth";

const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        if (errorData && errorData.error && errorData.error.code) {
          throw errorData.error; // Throw the error object
        } else {
          throw new Error("Unknown error occurred"); // Throw a generic error
        }
      }

      return response.json(); // Return response data if successful
    } catch (error) {
      throw error; // Rethrow the error
    }
  },
  register: async (userInfo) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw await response.json();
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw await response.json();
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default authAPI;
