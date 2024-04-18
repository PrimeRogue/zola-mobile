import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import conversationApi from "../api/ConversationApi";

export default function ImagePickerExample() {
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    console.log(result.assets.map((asset) => asset.uri));
    setSelectedImages(result.assets.map((asset) => asset.uri));
    // if (!result.canceled) {
    //   setSelectedImages(result.uri);
    // }
  };

  //   const handleSendImages = async () => {
  //     try {
  //       const access_token =
  //         "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyOThjZDA3NTlkOGNmN2JjZTZhZWNhODExNmU4ZjYzMDlhNDQwMjAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoibGluaDFAbGl2ZWdlbmN5LmNvbSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS96b2xhLWJlYTI4IiwiYXVkIjoiem9sYS1iZWEyOCIsImF1dGhfdGltZSI6MTcxMzM4MTA4OCwidXNlcl9pZCI6ImpiQ0owd3BCRURUM2I1d1p3RTZ5VG1xU2dMMzMiLCJzdWIiOiJqYkNKMHdwQkVEVDNiNXdad0U2eVRtcVNnTDMzIiwiaWF0IjoxNzEzMzgxMDg4LCJleHAiOjE3MTMzODQ2ODgsImVtYWlsIjoibGluaDFAbGl2ZWdlbmN5LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImxpbmgxQGxpdmVnZW5jeS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.DEGFonz9iskOR66LoBRCcP_FWBbe5-7b02Vje84LMlGMg1GBYiy6TYmXZ7NoUFE0V8T_NQ-2MipmCVeoEuTyMUb82XUsRTM-fT1KYkSkjNORWImquS0ekHH6_RmUlC2QLx2GGwgmWy5QPifm9AjZRpb293nY1fkuQ-HR4sxAeVdMoPQXDMjJhqqIdQH_karRwpEDASBMPjL6-XIxVOwAEO2IXn3B7IoNH9BOBhGHYhRdccobNpvF4jNab1xYKVRS4Appl3j5H8m-tzWQXd_Y5mQFdcZ_GEsWnuQNoFl4NDLGkf82rJiOrolE3ip8-dnyvGV4RP3Xmzuv4MllHk5DyA"; // Replace with your conversation ID
  //       const conversationId = "661e8cd16ddccdd6f87d1487"; // Replace with your access token
  //       const response = await conversationApi.sendImageMessage(
  //         conversationId,
  //         selectedImages,
  //         access_token
  //       );
  //       console.log("Image message sent successfully:", response);
  //     } catch (error) {
  //       console.error("Failed to send image message:", error);
  //     }
  //   };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick Images" onPress={pickImages} />
      <ScrollView horizontal>
        {selectedImages.map((imageUri, index) => (
          <TouchableOpacity key={index}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, margin: 5 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedImages.length > 0 && (
        <TouchableOpacity
          //   onPress={handleSendImages}
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white" }}>Send Images</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
