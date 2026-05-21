import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { corgiAdvisor } from "../data/moscowGuide";

type Props = {
  itemCount: number;
  activeLabel: string;
};

export function AdvisorPanel({ itemCount, activeLabel }: Props) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [bounce]);

  const mascotStyle = {
    transform: [
      {
        translateY: bounce.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        })
      },
      {
        rotate: bounce.interpolate({
          inputRange: [0, 1],
          outputRange: ["-2deg", "3deg"]
        })
      }
    ]
  } as const;

  return (
    <View style={styles.panel}>
      <Animated.View style={mascotStyle as never}>
        <Image source={{ uri: corgiAdvisor.imageUrl }} style={styles.avatar} />
      </Animated.View>
      <View style={styles.copy}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{corgiAdvisor.name}</Text>
          <Ionicons name="sparkles-outline" size={15} color="#f0c36d" />
        </View>
        <Text style={styles.line}>
          {activeLabel}: нашел {itemCount} вариантов. {corgiAdvisor.line}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3a3028"
  },
  copy: {
    flex: 1
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
  },
  name: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fffaf1"
  },
  line: {
    fontSize: 13,
    lineHeight: 18,
    color: "#eadfce"
  }
});
