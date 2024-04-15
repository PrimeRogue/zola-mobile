import React from "react";
import { useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import Lightbox from "react-native-lightbox";
const ImageMessage = ({ content, createdAt, isUser }) => {
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
        alignSelf: "flex-end",
        marginTop: 15,
        marginBottom: 15,
        width: "70%",
      }}
    >
      <Lightbox underlayColor="white">
        <Image
          source={content}
          style={{
            maxWidth: "100%",
            width: "100%",
            height: 250,
            maxHeight: "100%",
            borderRadius: 10,
            resizeMode: "contain",
          }}
        />
      </Lightbox>
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
        width: "70%",
      }}
    >
      <Image
        source={content}
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
          gap: 10,
          width: "fit-content",
          alignSelf: "flex-start",
          flexGrow: 1,
        }}
      >
        <Lightbox underlayColor="white">
          <Image
            source={content}
            style={{
              maxWidth: "100%",
              width: "100%",
              width: 250,
              height: 250,
              borderRadius: 10,
              resizeMode: "cover",
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          />
        </Lightbox>
        <Text style={{ fontSize: 16, color: "#ccc" }}>15:04</Text>
      </View>
    </View>
  );
};

export default ImageMessage;
