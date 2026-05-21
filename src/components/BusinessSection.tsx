import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { businessPlans, securityPrinciples } from "../data/onboarding";

export function BusinessSection() {
  const [selectedPlanId, setSelectedPlanId] = useState("local");
  const [submission, setSubmission] = useState(
    "18 мая, 19:00, винный ужин на Таганке, 20 мест, 3500 ₽, ссылка на афишу..."
  );
  const [processed, setProcessed] = useState(false);

  const selectedPlan = useMemo(
    () => businessPlans.find((plan) => plan.id === selectedPlanId) ?? businessPlans[1],
    [selectedPlanId]
  );

  const generatedTitle = submission.toLowerCase().includes("вин")
    ? "Винный ужин на Таганке"
    : "Новое мероприятие рядом";

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Тарифы для бизнеса</Text>
      <Text style={styles.sectionLead}>
        Цены ниже входного порога крупных геосервисов: бизнес платит за понятную локальную
        карточку и обработку мероприятия, а не за сложный рекламный кабинет.
      </Text>

      {businessPlans.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => setSelectedPlanId(plan.id)}
          style={[
            styles.plan,
            plan.recommended && styles.recommended,
            selectedPlanId === plan.id && styles.selectedPlan
          ]}
        >
          {plan.recommended && <Text style={styles.badge}>Рекомендуем</Text>}
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
          <Text style={styles.description}>{plan.description}</Text>
          {plan.features.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Ionicons name="sparkles-outline" size={15} color="#f0c36d" />
              <Text style={styles.feature}>{feature}</Text>
            </View>
          ))}
        </Pressable>
      ))}

      <View style={styles.form}>
        <Text style={styles.formTitle}>Быстрая отправка мероприятия</Text>
        <Text style={styles.formLead}>
          Бизнес скидывает информацию как есть. MapClap дальше сам собирает карточку,
          визуальный стиль, категорию, теги и текст для модерации.
        </Text>
        <TextInput
          editable
          multiline
          value={submission}
          onChangeText={(text) => {
            setSubmission(text);
            setProcessed(false);
          }}
          style={styles.input}
        />
        <Pressable style={styles.processButton} onPress={() => setProcessed(true)}>
          <Ionicons name="color-wand-outline" size={18} color="#fffaf1" />
          <Text style={styles.processLabel}>Собрать карточку через AI</Text>
        </Pressable>

        {processed && (
          <View style={styles.preview}>
            <Text style={styles.previewKicker}>Черновик после обработки</Text>
            <Text style={styles.previewTitle}>{generatedTitle}</Text>
            <Text style={styles.previewText}>
              Категория: еда. Вайб: камерный вечер. Теги: дегустация, ужин,
              свидание. Статус: ждет оплаты и модерации.
            </Text>
          </View>
        )}

        <Pressable style={styles.payButton}>
          <Ionicons name="card-outline" size={18} color="#201a15" />
          <Text style={styles.payLabel}>Оплатить {selectedPlan.price} и отправить</Text>
        </Pressable>
        <Text style={styles.paymentNote}>
          MVP-экран. Реальная оплата подключается через backend: ЮKassa/CloudPayments,
          webhooks, чеки и модерация перед публикацией.
        </Text>
      </View>

      <View style={styles.security}>
        <Text style={styles.formTitle}>Защита от мошенников</Text>
        {securityPrinciples.map((item) => (
          <View key={item} style={styles.securityRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#73d0a3" />
            <Text style={styles.securityText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 4
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fffaf1",
    marginBottom: 6
  },
  sectionLead: {
    fontSize: 13,
    lineHeight: 19,
    color: "#d6c8b6",
    marginBottom: 12
  },
  plan: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  recommended: {
    borderColor: "#f0c36d"
  },
  selectedPlan: {
    borderWidth: 2
  },
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f0c36d",
    color: "#201a15",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 8
  },
  planName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fffaf1"
  },
  price: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: "900",
    color: "#f0c36d"
  },
  period: {
    fontSize: 12,
    color: "#b9aa99",
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6",
    marginBottom: 10
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 6
  },
  feature: {
    flex: 1,
    fontSize: 13,
    color: "#eadfce"
  },
  form: {
    marginTop: 8,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fffaf1"
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#201a15",
    marginBottom: 6
  },
  formLead: {
    fontSize: 13,
    lineHeight: 18,
    color: "#51483e",
    marginBottom: 10
  },
  input: {
    minHeight: 88,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f1e7d8",
    color: "#51483e",
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: "top"
  },
  processButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#201a15",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  processLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#fffaf1"
  },
  preview: {
    marginTop: 10,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f4eadb",
    borderWidth: 1,
    borderColor: "#d7c2a4"
  },
  previewKicker: {
    fontSize: 11,
    fontWeight: "900",
    color: "#9a5638",
    textTransform: "uppercase",
    marginBottom: 5
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#201a15",
    marginBottom: 5
  },
  previewText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#51483e"
  },
  payButton: {
    marginTop: 12,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#f0c36d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  payLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#201a15"
  },
  paymentNote: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 17,
    color: "#756b5e"
  },
  security: {
    marginTop: 12,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#dff3e8"
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#214632"
  }
});
