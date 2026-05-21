import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudienceMode } from "../types";
import { CorgiMascot3D } from "./CorgiMascot3D";

type Props = {
  audience: AudienceMode;
  onPress?: () => void;
};

export function MascotDock({ audience, onPress }: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.mascotSlot}>
        <CorgiMascot3D size={136} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Клэп рядом</Text>
          <Ionicons name="sparkles-outline" size={15} color="#f0c36d" />
        </View>
        <Text style={styles.text}>
          {audience === "users"
            ? "Спроси меня, и я подберу место или мероприятие под твое настроение."
            : "Спроси меня про тарифы, карточку, модерацию или привлечение клиентов."}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 14,
    minHeight: 166,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  mascotSlot: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center"
  },
  copy: {
    flex: 1
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fffaf1"
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6"
  }
});
