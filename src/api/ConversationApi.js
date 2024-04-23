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
  sendImageMessage: async (conversationId, formData, access_token) => {
    try {
      const response = await fetch(`${API_URL}/${conversationId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          // "Content-Type": "multipart/form-data",
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
};

export default conversationApi;
// /conversations
//    GET: fetchConversation()
//    POST: createConversation()
//        --> Đồng ý kết bạn xong thì 1 conversations sẽ được tạo
//        --> Sau đó fecth lại Conversation khi list conversation thay đổi

// /conversations/:conversationId
//    GET

// /conversations/:conversationId/messages
//    GET: fetchMessagesByConversationId()
//    POST: sendTextMessage()

// /conversations/:conversationId/images
//    POST: sendImageMessage()
//        --> Khi nhấn vào icon ảnh --> Chọn 1 hoặc nhiều thì tạo 1 <View> nằm dưới thẻ input

// /conversations/:conversationId/messages/:messageCuid
//    DELETE: revokeMessage()
