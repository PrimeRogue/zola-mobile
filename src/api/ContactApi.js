const API_URL = "http://localhost:8080/api/v1/contacts";

const contactApi = {
  getAllContact: async (access_token) => {
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
  sendFriendRequest: async (access_token, friendId) => {
    try {
      const response = await fetch(`${API_URL}/send-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json", // Thêm header Content-Type để chỉ định loại dữ liệu gửi đi
        },
        body: JSON.stringify({ friendId }), // Chuyển friendId thành object JSON trước khi gửi đi
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

export default contactApi;
