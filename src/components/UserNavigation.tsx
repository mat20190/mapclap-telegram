import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type UserTab = "profile" | "map" | "catalog";

type Props = {
  active: UserTab;
  onChange: (tab: UserTab) => void;
};

const tabs: { id: UserTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "profile", label: "Кабинет", icon: "person-outline" },
  { id: "map", label: "Карта", icon: "map-outline" },
  { id: "catalog", label: "Разделы", icon: "grid-outline" }
];

export function UserNavigation({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={[styles.tab, active === tab.id && styles.activeTab]}
          onPress={() => onChange(tab.id)}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={active === tab.id ? "#201a15" : "#d6c8b6"}
          />
          <Text style={[styles.label, active === tab.id && styles.activeLabel]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
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
  tab: {
    flex: 1,
    minHeight: 46,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 2
  },
  activeTab: {
    backgroundColor: "#f0c36d"
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    color: "#d6c8b6"
  },
  activeLabel: {
    color: "#201a15"
  }
});
