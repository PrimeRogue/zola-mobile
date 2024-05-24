import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import * as FileSystem from "expo-file-system";
import {
  AntDesignIcon,
  FontAwesomeIcon,
  MaterialIconsIcon,
} from "../../utils/IconUtils";

const downloadFileWeb = (uri) => {
  const link = document.createElement("a");
  link.href = uri;
  link.download = uri.substring(uri.lastIndexOf("/") + 1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload = (content) => {
  if (Platform.OS === "web") {
    console.log("yes");
    downloadFileWeb(content);
  }
};
const renderFileName = (content) => {
  let extractFileName1 = content.split("/").reverse();
  let extractFileName2 = extractFileName1[0].split("-").reverse();
  return extractFileName2[0];
};
const renderIcon = (content) => {
  let extractFileName3 = renderFileName(content);
  let extractFileExtension = extractFileName3.split(".").reverse();
  let fileExtension = extractFileExtension[0];
  switch (fileExtension) {
    case "mp4":
      return <MaterialIconsIcon name="video-library" size={50} color="#000" />;
    case "pdf":
      return <AntDesignIcon name="pdffile1" size={50} color="#F79B3F" />;
    case "ptt":
    case "pptx":
      return <AntDesignIcon name="pptfile1" size={50} color="#C43E1C" />;
    case "txt":
      return <AntDesignIcon name="filetext1" size={50} color="#ccc" />;
    case "xls":
    case "xlsx":
      return <AntDesignIcon name="exclefile1" size={50} color="#1F7145" />;
    case "doc":
    case "docx":
      return <AntDesignIcon name="wordfile1" size={50} color="#1E90FF" />;
    case "gif":
      return <MaterialIconsIcon name="gif" size={50} color="#1E90FF" />;
    case "zip":
    case "rar":
      return <AntDesignIcon name="database" size={50} color="#EFC95A" />;
    case "png":
    case "jpg":
      return <AntDesignIcon name="jpgfile1" size={50} color="#EFC95A" />;
    default:
      return <AntDesignIcon name="folder1" size={50} color="#000" />;
  }
};

const FileMessage = ({ content, createdAt, isUser, photoUrl }) => {
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
      >
        {renderIcon(content)}
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {renderFileName(content)}
          </Text>
          <TouchableOpacity onPress={() => handleDownload(content)}>
            <AntDesignIcon name="download" size={20} color="teal" />
          </TouchableOpacity>
        </View>
      </View>

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
        <TouchableOpacity onPress={() => handleDownload(content)}>
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
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#ccc" }}>{createdAt}</Text>
      </View>
    </View>
  );
};

export default FileMessage;
