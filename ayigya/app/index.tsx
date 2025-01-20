import { Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import EntryComponentt from "./components/main_entry";
import "../global.css"



export default function index() {
 
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <EntryComponentt/>
    </View>
    </SafeAreaView>
  );
}
