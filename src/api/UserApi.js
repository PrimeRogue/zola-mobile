const API_URL = "https://zola-api.tranloc.click/api/v1/users/me";

const userApi = {
  getMe: async (access_token) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed!");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (access_token, displayName, dob, bio) => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, dob, bio }),
      });

      if (!response.ok) {
        throw new Error("Failed!");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;
