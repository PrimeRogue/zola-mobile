const API_URL = "http://localhost:8080/api/v1/conversations";

const conversationApi = {
  fetchConversation: async (access_token) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversation list");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  fetchMessagesByConversationId: async (conversationId, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}/messages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages for conversation");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default conversationApi;
