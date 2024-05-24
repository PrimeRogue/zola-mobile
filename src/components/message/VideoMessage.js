import React from "react";
import { View, Text, Image, Button, Platform } from "react-native";
import { ResizeMode, Video, VideoFullscreenUpdate } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "../../utils/IconUtils";

const VideoMessage = ({ content, createdAt, isUser, photoUrl }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    if (Platform.OS === "android") {
      if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
        await ScreenOrientation.unlockAsync();
      } else if (
        fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS
      ) {
        // lock the screen in Portrait orientation
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
    }
  };

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
      <Video
        source={{ uri: content }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={false}
        isLooping={false}
        useNativeControls
        style={{ width: "100%", height: 200, maxHeight: 400 }}
      />
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
        <Video
          ref={video}
          source={{ uri: content }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          useNativeControls
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onFullscreenUpdate={onFullscreenUpdate}
          style={{ width: "100%", maxHeight: 400, height: 200 }}
        />
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      </View>
    </View>
  );
};

export default VideoMessage;
