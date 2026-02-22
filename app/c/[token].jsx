import { useLocalSearchParams } from "expo-router";
import ReceiveScreen from "../../src/screens/ReceiveScreen";

export default function ReceivePage() {
  const { token } = useLocalSearchParams();
  return <ReceiveScreen token={token} />;
}
