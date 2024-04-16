import React, { useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import TooltipMessage from "./TooltipMessage";
import { TouchableOpacity } from "react-native-gesture-handler";
const TextMessage = ({
  content,
  createdAt,
  isUser,
  messageCuid,
  conversationId,
}) => {
  const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);
  return isUser ? (
    <TouchableOpacity
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
      onPress={() => {
        setIsVisibleTooltip(!isVisibleTooltip);
      }}
    >
      <Text style={{ fontSize: 18, color: "black" }}>{content}</Text>
      <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      {isVisibleTooltip && (
        <TooltipMessage
          messageCuid={messageCuid}
          conversationId={conversationId}
        ></TooltipMessage>
      )}
    </TouchableOpacity>
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

export default TextMessage;
