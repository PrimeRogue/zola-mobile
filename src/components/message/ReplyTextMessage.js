import React, { useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import TooltipMessage from "./TooltipMessage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "../../utils/IconUtils";
const ReplyTextMessage = ({
  content,
  createdAt,
  isUser,
  messageCuid,
  conversationId,
  photoUrl,
}) => {
  const [contentReply, textReply] = content.toString().split("type:REPLY");
  const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);
  return !isUser ? (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          backgroundColor: "#fff",
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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{ height: 40, width: 2, backgroundColor: "teal" }}
          ></View>
          <Text style={{ fontSize: 16, color: "#ccc" }}>{contentReply}</Text>
        </View>
        <Text style={{ fontSize: 18, color: "black" }}>{textReply}</Text>
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      </TouchableOpacity>
      {isVisibleTooltip && (
        <TooltipMessage
          messageCuid={messageCuid}
          conversationId={conversationId}
          content={content.toString()}
          isUser={isUser}
        ></TooltipMessage>
      )}
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

      <View style={{ display: "flex", direction: "column", gap: 10 }}>
        <TouchableOpacity
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
          onPress={() => {
            setIsVisibleTooltip(!isVisibleTooltip);
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
              style={{ height: 40, width: 2, backgroundColor: "teal" }}
            ></View>
            <Text style={{ fontSize: 16, color: "#ccc" }}>{contentReply}</Text>
          </View>
          <Text style={{ fontSize: 18, color: "black" }}>{textReply}</Text>
          <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
        </TouchableOpacity>
        {isVisibleTooltip && (
          <TooltipMessage
            messageCuid={messageCuid}
            conversationId={conversationId}
            content={content}
            isUser={isUser}
          ></TooltipMessage>
        )}
      </View>
    </View>
  );
};

export default ReplyTextMessage;
