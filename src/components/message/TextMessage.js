import React from "react";
import { View, Text, Image } from "react-native";

const TextMessage = ({ content, createdAt, isUser }) => {
  return isUser ? (
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
        alignSelf: "flex-end",
        marginTop: 15,
        marginBottom: 15,
        maxWidth: "70%",
      }}
    >
      <Text style={{ fontSize: 18, color: "black" }}>{content}</Text>
      <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
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

export default TextMessage;
