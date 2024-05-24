import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
// import {
//   ZegoUIKitPrebuiltCall,
//   ONE_ON_ONE_VIDEO_CALL_CONFIG,
// } from "@zegocloud/zego-uikit-prebuilt-call-rn";

const VideoCallScreen = ({ route }) => {
  const { userID, userName, navigation } = route.params;
  let appID = "623586323";
  let appSign =
    "3c076579777471d9a97f9d2bb10016e1009a60c484b45c6e102373ce660541ad";
  let callID = "1111";
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "white",
      }}
    >
      {/* <ZegoUIKitPrebuiltCall
        appID={appID}
        appSign={appSign}
        userID={userID} // userID can be something like a phone number or the user id on your own user system.
        userName={userName}
        callID={callID} // callID can be any unique string.
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onOnlySelfInRoom: () => {
            navigation.navigate("ChatScreen");
          },
          onHangUp: () => {
            navigation.navigate("ChatScreen");
          },
        }}
      /> */}
    </View>
  );
};

export default VideoCallScreen;
