import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const Notification = ({ title, message }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trượt lên và ẩn sau 2 giây
      notificationRef.slideOutUp(500).then(() => {
        // Xóa component sau khi hoàn thành hiệu ứng
        // Điều này sẽ không xảy ra nếu component đã bị unmount trước đó
        notificationRef = null;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [title]);

  return (
    <Animatable.View
      ref={(ref) => (notificationRef = ref)}
      style={styles.container}
      animation="slideInDown"
      duration={500}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animatable.View>
  );
};

let notificationRef;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    margin: 10,
    position: "absolute",
    top: "0",
    backgroundColor: "white",
    padding: 10,
    zIndex: 9999,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    color: "#ccc",
    fontSize: 16,
  },
});

export default Notification;
