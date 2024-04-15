import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
export const sendNotification = async (title, message) => {
  try {
    if (Platform.OS === "web") {
      // Kiểm tra xem trình duyệt hỗ trợ Web Notifications API hay không
      if ("Notification" in window) {
        // Yêu cầu quyền hạn thông báo nếu cần
        if (Notification.permission !== "granted") {
          await Notification.requestPermission();
        }

        // Kiểm tra lại quyền hạn sau khi người dùng đã chấp nhận
        if (Notification.permission === "granted") {
          // Gửi thông báo trên trình duyệt web
          new Notification(title, { body: message });
        } else {
          throw new Error("Notification permissions not granted");
        }
      } else {
        console.log("Web Notifications API is not supported in this browser.");
      }
    } else {
      // Gửi thông báo trên thiết bị di động
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        throw new Error("Notification permissions not granted");
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
