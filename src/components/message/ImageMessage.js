import React from "react";
import { useState } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import Lightbox from "react-native-lightbox";
import { AntDesignIcon, FontAwesomeIcon } from "../../utils/IconUtils";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

async function handleDownloadImage(uri) {
  if (Platform.OS === "web") {
    window.open(uri);
  } else {
    const fileUri = FileSystem.documentDirectory + uri.split("/").pop();
    const result = await FileSystem.downloadAsync(uri, fileUri);

    if (result && result.uri) {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Sharing.shareAsync(result.uri);
      }
    }
  }
}

const ImageMessage = ({ content, createdAt, isUser, photoUrl }) => {
  return !isUser ? (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        backgroundColor: "#fff",
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
        <TouchableOpacity onPress={() => handleDownloadImage(content.uri)}>
          <AntDesignIcon name="download" size={20} color="teal" />
        </TouchableOpacity>
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
        width: "90%",
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {photoUrl && (
          <Image
            source={{ uri: photoUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              resizeMode: "cover",
            }}
          ></Image>
        )}
        {!photoUrl && (
          <FontAwesomeIcon
            name="user-circle"
            color="#A0AEC0"
            size={50}
          ></FontAwesomeIcon>
        )}
      </View>
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
              height: 250,
              maxHeight: "100%",
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
        </Lightbox>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
          <TouchableOpacity onPress={() => handleDownloadImage(content.uri)}>
            <AntDesignIcon name="download" size={20} color="teal" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ImageMessage;
