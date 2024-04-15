import AuthStackNavigator from "./src/navigation/AuthStackNavigator";
import HomeStackNavigator from "./src/navigation/HomeStackNavigator";
import ChatScreen from "./src/screens/ChatScreen";
import ContactScreen from "./src/screens/ContactScreen";
import ConversationScreen from "./src/screens/ConversationScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

export default function App() {
  // return <ConversationScreen></ConversationScreen>;
  // return <RegisterScreen></RegisterScreen>;
  // return <AuthStackNavigator></AuthStackNavigator>;
  return <ContactScreen></ContactScreen>;
}
