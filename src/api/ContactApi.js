const API_URL = "https://zola-api.tranloc.click/api/v1/contacts";

const contactApi = {
  // 8->10
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
  // 11->13
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
  //14->16
  acceptFriendRequest: async (access_token, friendId) => {
    try {
      const response = await fetch(`${API_URL}/acept-request`, {
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
  //17->19
  getAllFriend: async (access_token) => {
    try {
      const response = await fetch(`${API_URL}/get-friends`, {
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
  // 20->22: Lấy danh sách người gửi yêu cầu cho mình
  getFriendRequest: async (access_token) => {
    try {
      const response = await fetch(`${API_URL}/get-friends-request`, {
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
  // 23->25
  removeFriend: async (access_token, friendId) => {
    try {
      const response = await fetch(`${API_URL}/remove-friend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
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
