import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StoredUser } from "../services/localDatabase";

type Props = {
  users: StoredUser[];
  onClose: () => void;
};

export function FounderDashboard({ users, onClose }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>FOUNDER PANEL</Text>
          <Text style={styles.title}>MapClap Admin</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color="#201a15" />
        </Pressable>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{users.length}</Text>
          <Text style={styles.metricLabel}>пользователей</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>локально</Text>
          <Text style={styles.metricLabel}>тип базы</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Пользователи</Text>
      {users.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Пока нет зарегистрированных пользователей.</Text>
        </View>
      ) : (
        users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userText}>{user.email}</Text>
            <Text style={styles.userText}>{user.phone}</Text>
            <Text style={styles.userText}>Город: {user.city}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: "#15120f"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    color: "#f0c36d"
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "900",
    color: "#fffaf1"
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#f0c36d",
    alignItems: "center",
    justifyContent: "center"
  },
  metrics: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18
  },
  metric: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fffaf1"
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#d6c8b6"
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fffaf1",
    marginBottom: 10
  },
  empty: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#201a15"
  },
  emptyText: {
    color: "#d6c8b6",
    fontSize: 14
  },
  userCard: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fffaf1",
    marginBottom: 10
  },
  userName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#201a15"
  },
  userText: {
    marginTop: 4,
    fontSize: 13,
    color: "#51483e"
  }
});
