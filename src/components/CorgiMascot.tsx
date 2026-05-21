import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  size?: number;
};

export function CorgiMascot({ size = 112 }: Props) {
  const float = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;
  const tail = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1100, useNativeDriver: true })
      ])
    );
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.delay(2300)
      ])
    );
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tail, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(tail, { toValue: 0, duration: 180, useNativeDriver: true })
      ])
    );

    floatLoop.start();
    blinkLoop.start();
    tailLoop.start();
    return () => {
      floatLoop.stop();
      blinkLoop.stop();
      tailLoop.stop();
    };
  }, [blink, float, tail]);

  const scale = size / 150;

  return (
    <Animated.View
      style={[
        styles.stage,
        {
          width: size,
          height: size,
          transform: [
            { scale },
            {
              translateY: float.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5]
              })
            }
          ]
        }
      ]}
    >
      <Animated.View
        style={[
          styles.tail,
          {
            transform: [
              {
                rotate: tail.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-10deg", "20deg"]
                })
              }
            ]
          }
        ]}
      />
      <View style={styles.bodyShadow} />
      <View style={styles.body} />
      <View style={styles.whiteBelly} />
      <View style={[styles.leg, styles.backLeg]} />
      <View style={[styles.leg, styles.frontLeg]} />
      <View style={styles.head}>
        <View style={[styles.ear, styles.leftEar]} />
        <View style={[styles.earInner, styles.leftEarInner]} />
        <View style={[styles.ear, styles.rightEar]} />
        <View style={[styles.earInner, styles.rightEarInner]} />
        <View style={styles.whiteBlaze} />
        <View style={styles.leftCheek} />
        <View style={styles.rightCheek} />
        <Animated.View
          style={[
            styles.eye,
            styles.leftEye,
            {
              transform: [
                {
                  scaleY: blink.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.18]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.eyeShine} />
        </Animated.View>
        <Animated.View
          style={[
            styles.eye,
            styles.rightEye,
            {
              transform: [
                {
                  scaleY: blink.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.18]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.eyeShine} />
        </Animated.View>
        <View style={styles.muzzle}>
          <View style={styles.nose} />
          <View style={styles.mouthLeft} />
          <View style={styles.mouthRight} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: "center"
  },
  bodyShadow: {
    position: "absolute",
    left: 16,
    top: 116,
    width: 96,
    height: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.18)"
  },
  body: {
    position: "absolute",
    left: 10,
    top: 72,
    width: 106,
    height: 48,
    borderRadius: 25,
    backgroundColor: "#c97838"
  },
  whiteBelly: {
    position: "absolute",
    left: 52,
    top: 73,
    width: 40,
    height: 45,
    borderRadius: 24,
    backgroundColor: "#f3efe2"
  },
  tail: {
    position: "absolute",
    left: 7,
    top: 83,
    width: 26,
    height: 18,
    borderRadius: 12,
    backgroundColor: "#a75d2b"
  },
  leg: {
    position: "absolute",
    top: 105,
    width: 18,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#6b5b52"
  },
  backLeg: {
    left: 30
  },
  frontLeg: {
    left: 84
  },
  head: {
    position: "absolute",
    left: 36,
    top: 25,
    width: 88,
    height: 76,
    borderRadius: 34,
    backgroundColor: "#c97838"
  },
  ear: {
    position: "absolute",
    top: -25,
    width: 31,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#b86931"
  },
  leftEar: {
    left: -5,
    transform: [{ rotate: "-12deg" }]
  },
  rightEar: {
    right: -5,
    transform: [{ rotate: "12deg" }]
  },
  earInner: {
    position: "absolute",
    top: -15,
    width: 17,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#b9846f"
  },
  leftEarInner: {
    left: 2,
    transform: [{ rotate: "-12deg" }]
  },
  rightEarInner: {
    right: 2,
    transform: [{ rotate: "12deg" }]
  },
  whiteBlaze: {
    position: "absolute",
    left: 39,
    top: 1,
    width: 16,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f3efe2"
  },
  leftCheek: {
    position: "absolute",
    left: 15,
    top: 44,
    width: 32,
    height: 27,
    borderRadius: 16,
    backgroundColor: "#f3efe2"
  },
  rightCheek: {
    position: "absolute",
    right: 10,
    top: 42,
    width: 34,
    height: 29,
    borderRadius: 16,
    backgroundColor: "#f3efe2"
  },
  eye: {
    position: "absolute",
    top: 29,
    width: 20,
    height: 28,
    borderRadius: 12,
    backgroundColor: "#1b1715",
    borderWidth: 3,
    borderColor: "#5a3d2d"
  },
  leftEye: {
    left: 23
  },
  rightEye: {
    right: 18
  },
  eyeShine: {
    position: "absolute",
    left: 4,
    top: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ffffff"
  },
  muzzle: {
    position: "absolute",
    left: 39,
    top: 52,
    width: 36,
    height: 27,
    borderRadius: 18,
    backgroundColor: "#f3efe2"
  },
  nose: {
    position: "absolute",
    left: 9,
    top: -3,
    width: 23,
    height: 17,
    borderRadius: 12,
    backgroundColor: "#201a15"
  },
  mouthLeft: {
    position: "absolute",
    left: 7,
    top: 14,
    width: 13,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#201a15",
    borderRadius: 8
  },
  mouthRight: {
    position: "absolute",
    right: 6,
    top: 14,
    width: 13,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#201a15",
    borderRadius: 8
  }
});
