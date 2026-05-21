import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { AdvisorChat } from "./AdvisorChat";
import { CorgiMascot } from "./CorgiMascot";
import { MascotDock } from "./MascotDock";

type Props = {
  businessName: string;
  ownerName: string;
  onLogout: () => void;
};

type BusinessAsset = {
  id: string;
  title: string;
  type: "place" | "event";
  status: "draft" | "moderation" | "published";
  address: string;
  imageUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const tariffs = [
  {
    id: "event",
    title: "Мероприятие",
    price: "990 ₽",
    period: "7 дней",
    detail: "Афиша, карточка, показ в категории и отчет после размещения."
  },
  {
    id: "place",
    title: "Место",
    price: "2 900 ₽",
    period: "30 дней",
    detail: "Карточка места, галерея, видео-ссылка, метка на карте и базовая аналитика."
  },
  {
    id: "pack",
    title: "Пакет",
    price: "9 900 ₽",
    period: "5 размещений",
    detail: "Для серии событий или нескольких точек с ручной модерацией."
  }
];

export function BusinessDashboard({ businessName, ownerName, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "cards" | "create">("overview");
  const [submissionType, setSubmissionType] = useState<"place" | "event">("place");
  const [freeGenerationsLeft, setFreeGenerationsLeft] = useState(5);
  const [rawInfo, setRawInfo] = useState(
    "Название, адрес, описание, график, цены, ссылка на сайт/соцсети..."
  );
  const [mediaInfo, setMediaInfo] = useState(
    "Добавьте ссылки на фотографии места/мероприятия или напишите: фото отправим позже"
  );
  const [assets, setAssets] = useState<BusinessAsset[]>([]);
  const [draft, setDraft] = useState<BusinessAsset | null>(null);
  const [contactRequest, setContactRequest] = useState("");

  const publishedCount = assets.filter((asset) => asset.status === "published").length;
  const hasAnalytics = publishedCount > 0;

  const selectedTariff = useMemo(
    () => tariffs.find((tariff) => tariff.id === submissionType) ?? tariffs[1],
    [submissionType]
  );

  const generateDraft = () => {
    const addressMatch = rawInfo.match(/(?:адрес|локация|место)\s*[:\-]\s*([^,\n]+)/i);
    const address = addressMatch?.[1]?.trim() || "Адрес не указан";
    const hasMedia = mediaInfo.trim() && !mediaInfo.toLowerCase().includes("фото отправим позже");
    const nextDraft: BusinessAsset = {
      id: `draft-${Date.now()}`,
      title: submissionType === "place" ? "Черновик места" : "Черновик мероприятия",
      type: submissionType,
      status: "draft",
      address,
      imageUrl:
        hasMedia && submissionType === "place"
          ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
          : hasMedia
            ? "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"
            : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      coordinates: { latitude: 55.7558, longitude: 37.6176 }
    };

    setDraft(nextDraft);
    setFreeGenerationsLeft((value) => Math.max(0, value - 1));
  };

  const addDraftToMap = () => {
    if (!draft) {
      return;
    }

    setAssets((current) => [{ ...draft, status: "moderation" }, ...current]);
    setDraft(null);
    setActiveTab("cards");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardWrap}
    >
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>BUSINESS: {ownerName}</Text>
          <Text style={styles.title}>{businessName}</Text>
          <Text style={styles.subtitle}>
            Кабинет для мест, мероприятий, рекламы, модерации и аналитики MapClap.
          </Text>
        </View>
        <CorgiMascot size={88} />
      </View>

      <View style={styles.tabs}>
        <Tab label="Обзор" active={activeTab === "overview"} onPress={() => setActiveTab("overview")} />
        <Tab label="Карточки" active={activeTab === "cards"} onPress={() => setActiveTab("cards")} />
        <Tab label="Добавить" active={activeTab === "create"} onPress={() => setActiveTab("create")} />
      </View>

      <MascotDock audience="business" />
      <AdvisorChat audience="business" />

      {activeTab === "overview" && (
        <>
          <View style={styles.analyticsGrid}>
            <Metric label="Просмотры" value={hasAnalytics ? "после публикации" : "нет данных"} />
            <Metric label="Маршруты" value={hasAnalytics ? "после публикации" : "нет данных"} />
            <Metric label="Заявки" value={hasAnalytics ? "после публикации" : "нет данных"} />
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Как работает реклама для бизнеса</Text>
            <Text style={styles.panelText}>
              Добавьте место или мероприятие, сгенерируйте карточку, выберите тариф,
              оплатите размещение и отправьте на модерацию. После публикации здесь появятся
              реальные просмотры, переходы в маршрут и заявки.
            </Text>
          </View>
          <View style={styles.contactPanel}>
            <Text style={styles.contactTitle}>Связаться с MapClap</Text>
            <Text style={styles.contactText}>
              Оставьте запрос на размещение места, мероприятия или рекламной кампании.
              Команда MapClap обработает заявку, проверит материалы и поможет с запуском.
            </Text>
            <TextInput
              multiline
              value={contactRequest}
              onChangeText={setContactRequest}
              placeholder="Например: хочу разместить кафе и два мероприятия на выходные..."
              placeholderTextColor="#8d8072"
              style={styles.contactInput}
            />
            <Pressable style={styles.primaryButton}>
              <Ionicons name="mail-outline" size={18} color="#201a15" />
              <Text style={styles.primaryButtonText}>Отправить запрос</Text>
            </Pressable>
          </View>
          <View style={styles.companyGrid}>
            <CompanyTile title="Профиль" text="Название, контакты, сайт, график, вход и этаж." icon="business-outline" />
            <CompanyTile title="Фото и медиа" text="Обложка, галерея, фото от клиентов и будущие 360-материалы." icon="images-outline" />
            <CompanyTile title="Отзывы" text="Ответы на отзывы и уведомления о новых реакциях." icon="chatbubbles-outline" />
            <CompanyTile title="Реклама" text="Тарифы, модерация, статус размещения и результат кампании." icon="megaphone-outline" />
          </View>
          <Text style={styles.sectionTitle}>Тарифы ниже крупных карт</Text>
          {tariffs.map((tariff) => (
            <View key={tariff.id} style={styles.tariffCard}>
              <Text style={styles.tariffName}>{tariff.title}</Text>
              <Text style={styles.tariffPrice}>{tariff.price}</Text>
              <Text style={styles.tariffPeriod}>{tariff.period}</Text>
              <Text style={styles.tariffDetail}>{tariff.detail}</Text>
            </View>
          ))}
        </>
      )}

      {activeTab === "cards" && (
        <>
          <Text style={styles.sectionTitle}>Ваши карточки</Text>
          {assets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={32} color="#f0c36d" />
              <Text style={styles.emptyTitle}>Карточек пока нет</Text>
              <Text style={styles.emptyText}>
                Создайте первую карточку места или мероприятия. После модерации она появится
                на карте, а статистика начнет считаться.
              </Text>
              <Pressable style={styles.primaryButton} onPress={() => setActiveTab("create")}>
                <Text style={styles.primaryButtonText}>Добавить карточку</Text>
              </Pressable>
            </View>
          ) : (
            assets.map((asset) => (
              <View key={asset.id} style={styles.assetCard}>
                <Image source={{ uri: asset.imageUrl }} style={styles.assetImage} />
                <View style={styles.assetCopy}>
                  <Text style={styles.assetType}>
                    {asset.type === "place" ? "Место" : "Мероприятие"} ·{" "}
                    {asset.status === "moderation" ? "на модерации" : "черновик"}
                  </Text>
                  <Text style={styles.assetTitle}>{asset.title}</Text>
                  <Text style={styles.assetText}>{asset.address}</Text>
                  <Text style={styles.assetText}>Статистика появится после публикации.</Text>
                </View>
              </View>
            ))
          )}
          <View style={styles.mapWrap}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              initialRegion={{
                latitude: 55.742,
                longitude: 37.653,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
              }}
            >
              {assets.map((asset) => (
                <Marker
                  key={asset.id}
                  coordinate={asset.coordinates}
                  title={asset.title}
                  description={asset.address}
                />
              ))}
            </MapView>
          </View>
        </>
      )}

      {activeTab === "create" && (
        <View style={styles.createPanel}>
          <Text style={styles.sectionTitleDark}>Генерация карточки</Text>
          <Text style={styles.createLead}>
            Первые 5 генераций бесплатные. Потом бизнес выбирает тариф и оплачивает
            размещение перед модерацией.
          </Text>
          <View style={styles.typeSwitch}>
            <Choice
              label="Место"
              active={submissionType === "place"}
              onPress={() => setSubmissionType("place")}
            />
            <Choice
              label="Мероприятие"
              active={submissionType === "event"}
              onPress={() => setSubmissionType("event")}
            />
          </View>
          <Text style={styles.freeCounter}>
            Бесплатных генераций осталось: {freeGenerationsLeft}
          </Text>
          <TextInput
            multiline
            value={rawInfo}
            onChangeText={setRawInfo}
            style={styles.input}
          />
          <Text style={styles.inputLabel}>Фотографии или материалы</Text>
          <TextInput
            multiline
            value={mediaInfo}
            onChangeText={setMediaInfo}
            style={styles.mediaInput}
          />
          <Pressable style={styles.primaryButton} onPress={generateDraft}>
            <Ionicons name="sparkles-outline" size={18} color="#201a15" />
            <Text style={styles.primaryButtonText}>Сгенерировать карточку</Text>
          </Pressable>

          {draft && (
            <View style={styles.previewCard}>
              <Image source={{ uri: draft.imageUrl }} style={styles.previewImage} />
              <Text style={styles.previewKicker}>AI-черновик</Text>
              <Text style={styles.previewTitle}>{draft.title}</Text>
              <Text style={styles.previewText}>
                Тип: {draft.type === "place" ? "место" : "мероприятие"}. Адрес:{" "}
                {draft.address}. Тариф: {selectedTariff.price} / {selectedTariff.period}.
                {" "}Если фотографии не добавлены, карточка уйдет на доработку перед публикацией.
              </Text>
              <Pressable style={styles.payButton} onPress={addDraftToMap}>
                <Ionicons name="card-outline" size={18} color="#201a15" />
                <Text style={styles.primaryButtonText}>Выбрать тариф и отправить</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <Pressable style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Выйти из кабинета</Text>
      </Pressable>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.choice, active && styles.choiceActive]} onPress={onPress}>
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function CompanyTile({
  title,
  text,
  icon
}: {
  title: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.companyTile}>
      <Ionicons name={icon} size={20} color="#f0c36d" />
      <Text style={styles.companyTileTitle}>{title}</Text>
      <Text style={styles.companyTileText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 28
  },
  keyboardWrap: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 14
  },
  headerCopy: {
    flex: 1
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    color: "#f0c36d"
  },
  title: {
    marginTop: 4,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    color: "#fffaf1"
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#d6c8b6"
  },
  tabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#251f1a",
    borderWidth: 1,
    borderColor: "#3a3028",
    marginBottom: 14
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  tabActive: {
    backgroundColor: "#f0c36d"
  },
  tabText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#d6c8b6"
  },
  tabTextActive: {
    color: "#201a15"
  },
  analyticsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  metric: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  metricValue: {
    minHeight: 34,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    color: "#fffaf1"
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#b9aa99"
  },
  panel: {
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    marginBottom: 14
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fffaf1"
  },
  panelText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#d6c8b6"
  },
  contactPanel: {
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fffaf1",
    marginBottom: 14
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#201a15"
  },
  contactText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#51483e"
  },
  contactInput: {
    minHeight: 84,
    marginTop: 10,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f1e7d8",
    color: "#201a15",
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: "top"
  },
  companyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14
  },
  companyTile: {
    width: "48%",
    minHeight: 132,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028"
  },
  companyTileTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "900",
    color: "#fffaf1"
  },
  companyTileText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: "#d6c8b6"
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fffaf1",
    marginBottom: 10
  },
  tariffCard: {
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    marginBottom: 10
  },
  tariffName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fffaf1"
  },
  tariffPrice: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: "900",
    color: "#f0c36d"
  },
  tariffPeriod: {
    fontSize: 12,
    color: "#b9aa99"
  },
  tariffDetail: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6"
  },
  emptyState: {
    borderRadius: 8,
    padding: 18,
    backgroundColor: "#201a15",
    borderWidth: 1,
    borderColor: "#3a3028",
    alignItems: "center"
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#fffaf1"
  },
  emptyText: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 19,
    color: "#d6c8b6",
    textAlign: "center"
  },
  assetCard: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fffaf1",
    marginBottom: 12
  },
  assetImage: {
    width: "100%",
    height: 132
  },
  assetCopy: {
    padding: 14
  },
  assetType: {
    fontSize: 11,
    fontWeight: "900",
    color: "#9a5638",
    textTransform: "uppercase"
  },
  assetTitle: {
    marginTop: 4,
    fontSize: 19,
    fontWeight: "900",
    color: "#201a15"
  },
  assetText: {
    marginTop: 6,
    fontSize: 13,
    color: "#51483e"
  },
  mapWrap: {
    height: 260,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3a3028",
    marginTop: 4
  },
  map: {
    flex: 1
  },
  createPanel: {
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fffaf1"
  },
  sectionTitleDark: {
    fontSize: 21,
    fontWeight: "900",
    color: "#201a15",
    marginBottom: 6
  },
  createLead: {
    fontSize: 13,
    lineHeight: 18,
    color: "#51483e",
    marginBottom: 10
  },
  typeSwitch: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#f1e7d8",
    marginBottom: 10
  },
  choice: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  choiceActive: {
    backgroundColor: "#201a15"
  },
  choiceText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#51483e"
  },
  choiceTextActive: {
    color: "#fffaf1"
  },
  freeCounter: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "900",
    color: "#2f7d5f"
  },
  input: {
    minHeight: 110,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f1e7d8",
    color: "#201a15",
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: "top"
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "900",
    color: "#201a15"
  },
  mediaInput: {
    minHeight: 78,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f1e7d8",
    color: "#201a15",
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: "top"
  },
  primaryButton: {
    marginTop: 12,
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: "#f0c36d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12
  },
  payButton: {
    marginTop: 10,
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: "#f0c36d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#201a15"
  },
  previewCard: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#201a15"
  },
  previewImage: {
    width: "100%",
    height: 140
  },
  previewKicker: {
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 11,
    fontWeight: "900",
    color: "#f0c36d",
    textTransform: "uppercase"
  },
  previewTitle: {
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 19,
    fontWeight: "900",
    color: "#fffaf1"
  },
  previewText: {
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#d6c8b6"
  },
  logout: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#d6c8b6"
  }
});
