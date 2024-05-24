import React from "react";
import {
  formatConversationName,
  getConversationAvatar,
} from "../../utils/ConversationUtils";
import { formatDistance } from "date-fns";
import { Image, TouchableOpacity, View, Text } from "react-native";
import {
  EvilIconsIcon,
  FontAwesome5Icon,
  FontAwesomeIcon,
} from "../../utils/IconUtils";

const ConversationItem = ({
  conversation,
  userId,
  navigation,
  setIsMessagesChanged,
}) => {
  const extractTypeReply = (s) => {
    const index = s.indexOf("type:REPLY");
    if (index !== -1) {
      return s.substring(index + "type:REPLY".length).trim();
    }
    return s.trim();
  };

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBlockColor: "#ccc",
        borderBottomWidth: 1,
        backgroundColor: "white",
      }}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          conversationId: conversation.id,
          conversationName: conversation?.isGroup
            ? conversation.groupName.length > 27
              ? `${conversation.groupName.substring(0, 27)}...`
              : conversation.groupName
            : formatConversationName(conversation, userId).substring(0, 27),
          navigation: navigation,
          userId: userId,
          setIsMessagesChanged: setIsMessagesChanged,
          photoUrl: conversation.participants[1].photoUrl,
        })
      }
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          margin: 15,
          marginRight: 20,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {conversation.groupImage && (
          <Image
            source={{ uri: conversation.groupImage }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              resizeMode: "cover",
            }}
          ></Image>
        )}

        {conversation.isGroup && (
          <FontAwesomeIcon
            name="group"
            color="#A0AEC0"
            size={50}
          ></FontAwesomeIcon>
        )}

        {!conversation.isGroup && conversation.participants[1].photoUrl && (
          <Image
            source={{ uri: conversation.participants[1].photoUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              resizeMode: "cover",
            }}
          ></Image>
        )}

        {!conversation.isGroup && !conversation.participants[1].photoUrl && (
          <FontAwesomeIcon
            name="user-circle"
            color="#A0AEC0"
            size={60}
          ></FontAwesomeIcon>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: 500 }}>
          {conversation?.isGroup
            ? conversation.groupName.length > 20
              ? `${conversation.groupName.substring(0, 20)}...`
              : conversation.groupName
            : formatConversationName(conversation, userId).substring(0, 20)}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 500, color: "#848C8F" }}>
          {`${
            conversation?.latestMessage?.userId &&
            userId === conversation.latestMessage.userId
              ? "you: "
              : ""
          }${
            conversation?.latestMessage?.userId
              ? conversation?.latestMessage?.typeMessage === "TEXT"
                ? extractTypeReply(conversation?.latestMessage?.content)
                : `Sent attached ${conversation?.latestMessage?.typeMessage?.toLowerCase()}`
              : ""
          }`}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 450,
          color: "#848C8F",
          position: "absolute",
          right: 15,
          top: 6,
        }}
      >
        {formatDistance(new Date(conversation?.updatedAt), new Date())}
      </Text>
    </TouchableOpacity>
  );
};

export default ConversationItem;
