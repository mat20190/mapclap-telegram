import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUser = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  createdAt: string;
};

const USERS_KEY = "mapclap.users";
const SESSION_KEY = "mapclap.session";

export async function getUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    await AsyncStorage.removeItem(USERS_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
    return [];
  }
}

export async function saveUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(user: Omit<StoredUser, "id" | "createdAt">) {
  const users = await getUsers();
  const exists = users.find(
    (item) =>
      item.email.toLowerCase() === user.email.toLowerCase() || item.phone === user.phone
  );

  if (exists) {
    throw new Error("USER_EXISTS");
  }

  const storedUser: StoredUser = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  await saveUsers([...users, storedUser]);
  await AsyncStorage.setItem(SESSION_KEY, storedUser.id);
  return storedUser;
}

export async function loginUser(email: string, phone: string) {
  const users = await getUsers();
  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() || item.phone === phone.trim()
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await AsyncStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export async function getSessionUser() {
  try {
    const sessionId = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      return null;
    }

    const users = await getUsers();
    return users.find((user) => user.id === sessionId) ?? null;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function logoutUser() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
