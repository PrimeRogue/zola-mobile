import React from "react";
import {
  formatConversationName,
  getConversationAvatar,
} from "../../utils/ConversationUtils";
import { formatDistance } from "date-fns";
import { Image, TouchableOpacity, View, Text } from "react-native";

const ConversationItem = ({ conversation, userId, navigation }) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingLeft: 5,
        alignItems: "center",
        borderBlockColor: "#ccc",
        borderBottomWidth: 1,
        backgroundColor: "white",
      }}
      key={index}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          conversationId: conversation.id,
          conversationName: formatConversationName(conversation, userId),
          navigation: navigation,
          userId: userId,
        })
      }
    >
      <Image
        source={getConversationAvatar(conversation, userId)}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          resizeMode: "cover",
          margin: 15,
          marginRight: 20,
          borderWidth: 2,
          borderColor: "#ccc",
        }}
      />
      <View>
        <Text style={{ fontSize: 18, fontWeight: 500 }}>
          {formatConversationName(conversation, userId)}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 500, color: "#848C8F" }}>
          {`${userId === conversation.latestMessage.userId ? "you: " : ""}${
            conversation?.latestMessage?.typeMessage === "TEXT"
              ? conversation.latestMessage.content
              : `Sent attached ${conversation?.latestMessage?.typeMessage?.toLowerCase()}`
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
          top: 15,
        }}
      >
        {formatDistance(new Date(conversation?.updatedAt), new Date())}
      </Text>
    </TouchableOpacity>
  );
};

export default ConversationItem;
