import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GuideItem } from "../types";
import { categoryColors, categoryLabels } from "../data/moscowGuide";
import { generatedPlacePhoto, getPlacePhoto } from "../services/placeImages";
import { useState } from "react";
import { getPlaceTitle } from "../services/placeDisplay";

type Props = {
  item: GuideItem;
};

export function GuideCard({ item }: Props) {
  const color = categoryColors[item.category];
  const [photo, setPhoto] = useState(getPlacePhoto(item));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>{getPlaceTitle(item)}</Text>
          <Text style={styles.meta}>
            {categoryLabels[item.category]} · {item.price}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: photo }}
        style={styles.mainImage}
        onError={() => setPhoto(generatedPlacePhoto(item))}
      />
      <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
      <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

      <View style={styles.actions}>
        <View style={styles.action}>
          <Ionicons name="navigate-outline" size={16} color="#201a15" />
          <Text style={styles.actionText}>Маршрут</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="call-outline" size={16} color="#201a15" />
          <Text style={styles.actionText}>Контакты</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="bookmark-outline" size={16} color="#201a15" />
          <Text style={styles.actionText}>Сохранить</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.vibe} numberOfLines={1}>{item.vibe}</Text>
        <Text style={styles.schedule} numberOfLines={1}>{item.schedule}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 394,
    borderRadius: 8,
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#eadfce",
    padding: 14
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 7
  },
  titleBlock: {
    flex: 1
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    minHeight: 44,
    fontWeight: "900",
    color: "#201a15"
  },
  meta: {
    marginTop: 3,
    fontSize: 12,
    color: "#756b5e"
  },
  address: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 17,
    minHeight: 17,
    fontWeight: "800",
    color: "#51483e"
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 54,
    color: "#51483e"
  },
  mainImage: {
    width: "100%",
    height: 118,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#eadfce"
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    minHeight: 38
  },
  action: {
    flex: 1,
    minHeight: 38,
    borderRadius: 8,
    backgroundColor: "#f1e7d8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5
  },
  actionText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#201a15"
  },
  footer: {
    marginTop: "auto",
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  vibe: {
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    color: "#9a5638"
  },
  schedule: {
    flex: 1,
    fontSize: 12,
    color: "#756b5e",
    textAlign: "right"
  }
});
