import { Text, View } from "react-native";
import EntryComponentt from "./components/main_entry";
import "../global.css"



export default function index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <EntryComponentt/>
    </View>
  );
}
