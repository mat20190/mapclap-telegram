import { StyleSheet, View } from "react-native";

type Props = {
  mode?: "walk";
};

export function MapCorgiMarker({ mode = "walk" }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.shadow} />
      <View style={styles.dog}>
        <View style={styles.tail} />
        <View style={styles.body} />
        <View style={styles.whiteBack} />
        <View style={styles.head}>
          <View style={[styles.ear, styles.leftEar]} />
          <View style={[styles.ear, styles.rightEar]} />
          <View style={styles.backStripe} />
        </View>
        <View style={[styles.hindPaw, styles.hindLeft]} />
        <View style={[styles.hindPaw, styles.hindRight]} />
        <View style={[styles.frontPaw, styles.frontLeft]} />
        <View style={[styles.frontPaw, styles.frontRight]} />
        <View style={styles.directionNose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center"
  },
  shadow: {
    position: "absolute",
    bottom: 7,
    width: 48,
    height: 17,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  dog: {
    width: 58,
    height: 62,
    alignItems: "center"
  },
  body: {
    position: "absolute",
    top: 24,
    width: 48,
    height: 30,
    borderRadius: 18,
    backgroundColor: "#c97838",
    borderWidth: 1,
    borderColor: "rgba(32,26,21,0.12)"
  },
  whiteBack: {
    position: "absolute",
    top: 29,
    width: 15,
    height: 23,
    borderRadius: 10,
    backgroundColor: "#f3efe2"
  },
  tail: {
    position: "absolute",
    top: 34,
    right: 2,
    width: 16,
    height: 13,
    borderRadius: 12,
    backgroundColor: "#f3efe2",
    transform: [{ rotate: "28deg" }],
    zIndex: 4
  },
  head: {
    position: "absolute",
    top: 2,
    width: 35,
    height: 32,
    borderRadius: 18,
    backgroundColor: "#c97838",
    borderWidth: 1,
    borderColor: "rgba(32,26,21,0.12)",
    alignItems: "center"
  },
  ear: {
    position: "absolute",
    top: -13,
    width: 13,
    height: 21,
    borderRadius: 9,
    backgroundColor: "#a85d2a"
  },
  leftEar: {
    left: 0,
    transform: [{ rotate: "-18deg" }]
  },
  rightEar: {
    right: 0,
    transform: [{ rotate: "18deg" }]
  },
  backStripe: {
    position: "absolute",
    bottom: -1,
    width: 12,
    height: 17,
    borderRadius: 8,
    backgroundColor: "#f3efe2"
  },
  hindPaw: {
    position: "absolute",
    bottom: 2,
    width: 10,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#6b5b52"
  },
  hindLeft: {
    left: 12
  },
  hindRight: {
    right: 12
  },
  frontPaw: {
    position: "absolute",
    bottom: 8,
    width: 8,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#6b5b52"
  },
  frontLeft: {
    left: 22
  },
  frontRight: {
    right: 22
  },
  directionNose: {
    position: "absolute",
    top: -2,
    width: 7,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#201a15",
    opacity: 0.35
  }
});
