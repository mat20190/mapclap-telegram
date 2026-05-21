import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingStep } from "../types";

type Props = {
  title: string;
  steps: OnboardingStep[];
};

export function OnboardingSection({ title, steps }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.card}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
            <View style={styles.bullets}>
              {step.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={15} color="#f0c36d" />
                  <Text style={styles.bullet}>{bullet}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fffaf1",
    marginBottom: 10
  },
  card: {
    borderRadius: 8,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    gap: 12
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0c36d"
  },
  numberText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#201a15"
  },
  copy: {
    flex: 1
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
    color: "#fffaf1"
  },
  description: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6"
  },
  bullets: {
    marginTop: 10,
    gap: 6
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  bullet: {
    flex: 1,
    fontSize: 12,
    color: "#eadfce"
  }
});
