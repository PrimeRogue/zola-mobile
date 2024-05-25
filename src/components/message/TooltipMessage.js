import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import conversationApi from "../../api/ConversationApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIconsIcon } from "../../utils/IconUtils";

const TooltipMessage = ({ messageCuid, conversationId, content, isUser }) => {
  const [enableReply, setEnableReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleRevokeMessage = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(
        `http://localhost:8080/api/v1/conversations/${conversationId}/messages/${messageCuid}`
      );
      // Call the revokeMessage function from conversationApi
      const conversations = await conversationApi.revokeMessage(
        conversationId,
        messageCuid,
        accessToken
      );
      // Handle the response if needed
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }
  };

  const handleReplyMessage = async () => {
    try {
      setEnableReply(false);
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const data = await conversationApi.sendTextMessage(
        conversationId,
        content + "type:REPLY" + replyText,
        storedAccessToken
      );
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }
  };

  return (
    <View>
      {!enableReply ? (
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            backgroundColor: "white",
            width: "fit-content",
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity onPress={() => setEnableReply(!enableReply)}>
            <EntypoIcon name="forward" size={22} color="teal" />
          </TouchableOpacity>
          {!isUser && (
            <TouchableOpacity onPress={handleRevokeMessage}>
              <MaterialCommunityIconsIcon
                name="delete"
                size={22}
                color="teal"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity>
            <Icon name="smileo" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            borderRadius: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 15,
            backgroundColor: "transparent",
            backgroundColor: "white",
            width: "100%",
            alignSelf: "flex-end",
          }}
        >
          <TextInput
            style={{
              width: "100%",
              height: 40,
              backgroundColor: "transparent",
              color: "#8C8F91",
              flexGrow: 1,
              fontSize: 18,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 5,
            }}
            onChangeText={(text) => setReplyText(text)}
            value={replyText}
            placeholder="Trả lời tin nhắn"
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleReplyMessage}
            style={{
              width: 45,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "teal",
            }}
          >
            <EntypoIcon name="forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TooltipMessage;
