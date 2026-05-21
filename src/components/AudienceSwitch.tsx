import { Pressable, StyleSheet, Text, View } from "react-native";
import { AudienceMode } from "../types";

type Props = {
  mode: AudienceMode;
  onChange: (mode: AudienceMode) => void;
};

export function AudienceSwitch({ mode, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: mode === "users" }}
        onPress={() => onChange("users")}
        style={[styles.button, mode === "users" && styles.active]}
      >
        <Text style={[styles.label, mode === "users" && styles.activeLabel]}>
          Пользователь
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: mode === "business" }}
        onPress={() => onChange("business")}
        style={[styles.button, mode === "business" && styles.active]}
      >
        <Text style={[styles.label, mode === "business" && styles.activeLabel]}>
          Бизнес
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#251f1a",
    borderWidth: 1,
    borderColor: "#3a3028",
    flexDirection: "row"
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#f0c36d"
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#d6c8b6"
  },
  activeLabel: {
    color: "#201a15"
  }
});
