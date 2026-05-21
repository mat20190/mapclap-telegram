import { Pressable, StyleSheet, Text } from "react-native";
import { EventCategory } from "../types";
import { categoryColors, categoryLabels } from "../data/moscowGuide";

type Props = {
  category?: EventCategory;
  label?: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryPill({ category, label, selected, onPress }: Props) {
  const color = category ? categoryColors[category] : "#201a15";
  const text = label ?? (category ? categoryLabels[category] : "");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.pill,
        selected && { backgroundColor: color, borderColor: color }
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d8d0c3",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffaf1",
    marginRight: 8
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b352c"
  },
  selectedLabel: {
    color: "#ffffff"
  }
});
