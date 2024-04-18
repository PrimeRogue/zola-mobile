import React, { useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import TooltipMessage from "./TooltipMessage";
import { TouchableOpacity } from "react-native-gesture-handler";
const ReplyTextMessage = ({
  content,
  createdAt,
  isUser,
  messageCuid,
  conversationId,
}) => {
  const [contentReply, textReply] = content.uri.toString().split("type:REPLY");
  console.log(content);
  return !isUser ? (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          backgroundColor: "#D5F1FF",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: "fit-content",
          marginTop: 15,
          marginBottom: 15,
          maxWidth: "60%",
          alignSelf: "flex-end",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{ height: 50, width: 2, backgroundColor: "teal" }}
          ></View>
          <Text style={{ fontSize: 16, color: "#ccc" }}>{contentReply}</Text>
        </View>
        <Text style={{ fontSize: 18, color: "black" }}>{textReply}</Text>
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      </View>
    </View>
  ) : (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        marginTop: 15,
        marginBottom: 15,
        maxWidth: "70%",
      }}
    >
      <Image
        // source={require("https://source.unsplash.com/random")}
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          resizeMode: "cover",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      />
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: "fit-content",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ fontSize: 18, color: "black" }}>{content}</Text>
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      </View>
    </View>
  );
};

export default ReplyTextMessage;
