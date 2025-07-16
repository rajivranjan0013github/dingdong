import { View } from "react-native";
import { Text } from "../components/ui/text";
import { Button } from "../components/ui/button";

export default function HomeScreen() {
  return (
    <View className="bg-red-500">
      <Text>HomeScreen</Text>
      <Button><Text>Click me</Text></Button>
    </View>
  );
}