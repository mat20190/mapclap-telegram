import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GuideItem } from "../types";

type Props = {
  places: GuideItem[];
  onSelect: (place: GuideItem) => void;
};

export function OnlineTour({ places, onSelect }: Props) {
  const route = places.slice(0, 5);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Онлайн-экскурсия по Таганке</Text>
      <Text style={styles.lead}>
        Клэп собирает короткий маршрут: место за местом, с фото, описанием и переходом
        к точке на карте.
      </Text>
      {route.map((place, index) => (
        <Pressable key={place.id} style={styles.step} onPress={() => onSelect(place)}>
          <Image source={{ uri: place.imageUrl }} style={styles.image} />
          <View style={styles.copy}>
            <Text style={styles.stepNumber}>Точка {index + 1}</Text>
            <Text style={styles.placeTitle}>{place.title}</Text>
            <Text style={styles.placeText}>{place.vibe}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#b9aa99" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fffaf1"
  },
  lead: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6"
  },
  step: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#3a3028"
  },
  image: {
    width: 62,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#3a3028"
  },
  copy: {
    flex: 1
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: "900",
    color: "#f0c36d",
    textTransform: "uppercase"
  },
  placeTitle: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "900",
    color: "#fffaf1"
  },
  placeText: {
    marginTop: 2,
    fontSize: 12,
    color: "#d6c8b6"
  }
});
