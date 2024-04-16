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
  sendTextMessage: async (conversationId, content, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send text message");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  sendImageMessage: async (conversationId, imageFile, access_token) => {
    try {
      const formData = new FormData();
      formData.append("images", imageFile);
      console.log(imageFile);
      console.log(formData.getAll("images"));
      const response = await fetch(`${API_URL}/${conversationId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data", // Explicitly specify Content-Type
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send image message");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  revokeMessage: async (conversationId, messageCuid, access_token) => {
    try {
      const response = await fetch(
        `${API_URL}/${conversationId}/messages/${messageCuid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to revoke message");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default conversationApi;
