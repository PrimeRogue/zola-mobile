import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import conversationApi from "../../api/ConversationApi";
const TooltipMessage = ({ messageCuid, conversationId }) => {
  console.log(
    `http://localhost:8080/api/v1/conversations/${conversationId}/messages/${messageCuid}`
  );
  const handleRevokeMessage = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(
        `http://localhost:8080/api/v1/conversations/${conversationId}/messages/${messageCuid}`
      );
      const conversations = await conversationApi.revokeMessage(
        conversationId,
        messageCuid,
        accessToken
      );
      console.log(conversations);
    } catch (error) {
      console.error("Lỗi khi thu hồi:", error.code);
    }
  };

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        backgroundColor: "transparent",
        backgroundColor: "white",
        width: "fit-content",
        position: "absolute",
        right: "110%",
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <TouchableOpacity onPress={() => console.log("Chuyển tiếp")}>
        <EntypoIcon name="forward" size={18} color="#ccc" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRevokeMessage()}>
        <Icon name="delete" size={18} color="teal" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="smileo" size={18} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
};

export default TooltipMessage;
