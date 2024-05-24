const API_URL = "https://zola-api.tranloc.click/api/v1/conversations";

const conversationApi = {
  //17
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
  //18
  createConversation: async (participantIds, groupName, access_token) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantIds, groupName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //22
  fetchConversationById: async (conversationId, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //23
  callVideo: async (conversationId, content, access_token) => {
    try {
      const response = await fetch(
        `${API_URL}/${conversationId}/startVideoCall`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //28
  deleteGroup: async (conversationId, access_token) => {
    try {
      const response = await fetch(`${API_URL}/group/${conversationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //32
  addMemberGroup: async (conversationId, participantIds, access_token) => {
    try {
      const response = await fetch(
        `${API_URL}/${conversationId}/group-member`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participantIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //36
  deleteMemberGroup: async (conversationId, userId, access_token) => {
    try {
      const response = await fetch(
        `${API_URL}/${conversationId}/group-member/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //40
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
  //41
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
  //45
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
  //49
  //50
  sendImageMessage: async (conversationId, formData, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
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
  //57
  //58
  sendFileMessage: async (conversationId, formData, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send file message");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
  //65
};

export default conversationApi;
