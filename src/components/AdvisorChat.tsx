import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudienceMode } from "../types";

type Message = {
  id: string;
  from: "user" | "clap";
  text: string;
};

type Props = {
  audience: AudienceMode;
};

export function AdvisorChat({ audience }: Props) {
  const starter = useMemo(
    () =>
      audience === "users"
        ? "Привет, я Клэп. Введи свой запрос: настроение, категорию или то, как хочешь провести время."
        : "Привет, я Клэп. Спроси меня: какой тариф выбрать, как оформить карточку, как пройти модерацию или как привлечь клиентов.",
    [audience]
  );
  const [messages, setMessages] = useState<Message[]>([
    { id: "starter", from: "clap", text: starter }
  ]);
  const [input, setInput] = useState("");

  const answer = (question: string) => {
    const normalized = question.toLowerCase();

    if (audience === "business") {
      if (normalized.includes("тариф") || normalized.includes("цена")) {
        return "Для быстрого теста бери мероприятие за 990 ₽. Для постоянной точки лучше место за 2 900 ₽ на 30 дней. Пакет 9 900 ₽ нужен, если планируешь несколько размещений.";
      }
      if (normalized.includes("модерац")) {
        return "Модерация проверяет адрес, легальность, фото, описание, контакты и рекламную маркировку. Так мы защищаем пользователей и бизнес от фейков.";
      }
      return "Пришли описание, адрес, фото или ссылку. Я соберу карточку, теги, категорию, визуальный стиль и черновик для карты.";
    }

    if (normalized.includes("хочу") || normalized.includes("пойти") || normalized.includes("куда")) {
      return "Введи свой запрос подробнее: настроение, категорию, бюджет или формат отдыха. Например: спокойно погулять, активно провести день, культурное место, вкусно поесть.";
    }
    if (normalized.includes("настро") || normalized.includes("вайб")) {
      return "Напиши, какой вайб нужен: спокойно, активно, культурно, вкусно, необычно или просто красиво погулять. Я соберу подборку под это настроение.";
    }
    if (normalized.includes("музей") || normalized.includes("культур")) {
      return "Из культурного маршрута советую Дом Высоцкого, Бункер-42, Музей русской иконы или Музей Андрея Рублева.";
    }
    if (normalized.includes("поесть") || normalized.includes("еда")) {
      return "Для еды рядом с маршрутом посмотри Community, Blanc или Richter. Я бы выбирал по настроению: тихо, красиво или вечер у воды.";
    }
    return "Я могу подобрать место по настроению: спокойно, активно, свидание, компания, культура, еда или прогулка. Напиши, какой вайб нужен.";
  };

  const send = () => {
    const text = input.trim();
    if (!text) {
      return;
    }

    const userMessage: Message = { id: `u-${Date.now()}`, from: "user", text };
    const clapMessage: Message = {
      id: `c-${Date.now()}`,
      from: "clap",
      text: answer(text)
    };
    setMessages((current) => [...current, userMessage, clapMessage]);
    setInput("");
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#f0c36d" />
        <Text style={styles.title}>Спросить Клэпа</Text>
      </View>
      {messages.slice(-3).map((message) => (
        <View
          key={message.id}
          style={[styles.bubble, message.from === "user" && styles.userBubble]}
        >
          <Text style={[styles.text, message.from === "user" && styles.userText]}>
            {message.text}
          </Text>
        </View>
      ))}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={audience === "users" ? "Введи свой запрос" : "Например: какой тариф выбрать?"}
          placeholderTextColor="#8d8072"
          style={styles.input}
        />
        <Pressable style={styles.sendButton} onPress={send}>
          <Ionicons name="send" size={16} color="#201a15" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fffaf1"
  },
  bubble: {
    alignSelf: "flex-start",
    maxWidth: "92%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fffaf1"
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#f0c36d"
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: "#201a15"
  },
  userText: {
    fontWeight: "800"
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fffaf1",
    color: "#201a15",
    fontSize: 13
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#f0c36d",
    alignItems: "center",
    justifyContent: "center"
  }
});
