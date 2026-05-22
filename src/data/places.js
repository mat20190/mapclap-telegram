export const categoryLabels = {
  all: "Все",
  sport: "Спорт",
  music: "Музыка",
  theatre: "Театр",
  museum: "Музеи",
  food: "Еда",
  fun: "Развлечения",
};

export const categoryColors = {
  sport: "#50d68a",
  music: "#8bb7ff",
  theatre: "#ff8d8d",
  museum: "#f7cc62",
  food: "#ffad66",
  fun: "#d59bff",
};

export const places = [
  {
    id: "tagansky-park",
    title: "Таганский парк",
    category: "sport",
    address: "Таганская улица, 40-42",
    coordinates: { lat: 55.73562, lon: 37.66512 },
    site: "https://taganskiypark.ru",
    schedule: "Ежедневно",
    price: "Бесплатно, активности отдельно",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    description:
      "Зеленая точка района для прогулок, пробежек, катка зимой и спокойных тренировок после учебы или работы.",
  },
  {
    id: "fok-taganka",
    title: "ФОК на Таганке",
    category: "sport",
    address: "Рабочая улица, 30",
    coordinates: { lat: 55.74005, lon: 37.67346 },
    site: "https://www.mos.ru/sport",
    schedule: "По расписанию секций",
    price: "По абонементам",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    description:
      "Бассейн, тренажерный зал и секции в понятном городском формате без лишнего пафоса.",
  },
  {
    id: "na-taganke-sport",
    title: "Спорткомплекс на Таганке",
    category: "sport",
    address: "Таганский район",
    coordinates: { lat: 55.74221, lon: 37.66184 },
    site: "https://www.mos.ru/sport",
    schedule: "По расписанию",
    price: "По занятиям",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
    description:
      "Универсальная спортивная точка для регулярных занятий, групповых тренировок и базовой физической формы.",
  },
  {
    id: "yauza-route",
    title: "Маршрут по Яузе",
    category: "sport",
    address: "Набережные Яузы",
    coordinates: { lat: 55.74662, lon: 37.66938 },
    site: "https://www.mos.ru",
    schedule: "Круглосуточно",
    price: "Бесплатно",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=85",
    description:
      "Маршрут для ходьбы, бега и велосипеда: вода, старые фасады и спокойный городской ритм.",
  },
  {
    id: "agglomerat",
    title: "Агломерат",
    category: "music",
    address: "Костомаровский переулок, 3с12",
    coordinates: { lat: 55.75124, lon: 37.66954 },
    site: "https://agglomerat.moscow",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    description:
      "Альтернативная концертная площадка с живыми выступлениями, электронными ночами и плотной сценической энергией.",
  },
  {
    id: "zaryadye",
    title: "Концертный зал Зарядье",
    category: "music",
    address: "улица Варварка, 6с4",
    coordinates: { lat: 55.75155, lon: 37.62882 },
    site: "https://zaryadyehall.com",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85",
    description:
      "Современный зал рядом с центром: симфонические концерты, камерная музыка и сильная акустика.",
  },
  {
    id: "powerhouse",
    title: "Powerhouse Moscow",
    category: "music",
    address: "Гончарная улица, 7/4с1",
    coordinates: { lat: 55.74379, lon: 37.64882 },
    site: "https://powerhousemoscow.com",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85",
    description:
      "Камерные концерты, диджей-сеты и барная атмосфера для вечера без ощущения массового зала.",
  },
  {
    id: "dom-muzyki",
    title: "Московский международный Дом музыки",
    category: "music",
    address: "Космодамианская набережная, 52с8",
    coordinates: { lat: 55.73393, lon: 37.64465 },
    site: "https://mmdm.ru",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1449518193813-37a7d8014e82?auto=format&fit=crop&w=1200&q=85",
    description:
      "Большие концерты, классика, джаз и заметные музыкальные события в нескольких залах.",
  },
  {
    id: "taganka-theatre",
    title: "Московский театр на Таганке",
    category: "theatre",
    address: "Земляной Вал, 76/21",
    coordinates: { lat: 55.74047, lon: 37.65316 },
    site: "https://tagankateatr.ru",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85",
    description:
      "Легендарный театр района: сильная история, современная афиша и узнаваемая таганская энергия.",
  },
  {
    id: "actors-taganka",
    title: "Содружество актеров Таганки",
    category: "theatre",
    address: "Земляной Вал, 76/21с1",
    coordinates: { lat: 55.7407, lon: 37.65389 },
    site: "https://taganka-sat.ru",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=85",
    description:
      "Театральная площадка с традицией старой Таганки и спектаклями для разного настроения.",
  },
  {
    id: "pokrovka-theatre",
    title: "Театр на Покровке",
    category: "theatre",
    address: "улица Покровка, 50/2с1",
    coordinates: { lat: 55.75961, lon: 37.65471 },
    site: "https://teatrnapokrovke.ru",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=85",
    description:
      "Камерный театр с близкой дистанцией между сценой и зрителем, хорош для спокойного вечера.",
  },
  {
    id: "theatre-doc",
    title: "Театр.doc",
    category: "theatre",
    address: "Малый Казенный переулок, 12",
    coordinates: { lat: 55.76162, lon: 37.65493 },
    site: "https://teatrdoc.ru",
    schedule: "По афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=85",
    description:
      "Независимая сцена для современной драматургии, острых тем и живого разговора со зрителем.",
  },
  {
    id: "russian-icons",
    title: "Музей русской иконы",
    category: "museum",
    address: "Гончарная улица, 3с1",
    coordinates: { lat: 55.74471, lon: 37.65087 },
    site: "https://russikona.ru",
    schedule: "Уточнять на сайте",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=85",
    description:
      "Один из самых заметных частных музеев Москвы с большой коллекцией икон и древнерусского искусства.",
  },
  {
    id: "bunker-42",
    title: "Бункер-42 на Таганке",
    category: "museum",
    address: "5-й Котельнический переулок, 11",
    coordinates: { lat: 55.74169, lon: 37.64971 },
    site: "https://bunker42.com",
    schedule: "По экскурсиям",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
    description:
      "Подземный музей холодной войны: настоящий бункер, экскурсии и необычное ощущение скрытой Москвы.",
  },
  {
    id: "vysotsky",
    title: "Музей Высоцкого",
    category: "museum",
    address: "улица Высоцкого, 3с1",
    coordinates: { lat: 55.74342, lon: 37.65325 },
    site: "https://visotsky.ru",
    schedule: "Уточнять на сайте",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=85",
    description:
      "Место про голос, эпоху и атмосферу Таганки, связанную с Владимиром Высоцким.",
  },
  {
    id: "museum-sobranie",
    title: "Музей Собрание",
    category: "museum",
    address: "улица Солянка, 16",
    coordinates: { lat: 55.75198, lon: 37.64181 },
    site: "https://mus-col.com",
    schedule: "По записи и афише",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85",
    description:
      "Коллекция механизмов, часов, музыкальных автоматов и редких предметов для неспешного погружения.",
  },
  {
    id: "megreliya",
    title: "Мегрелия",
    category: "food",
    address: "Марксистская улица, 7",
    coordinates: { lat: 55.73991, lon: 37.65791 },
    site: "https://megreliya.ru",
    schedule: "Ежедневно",
    price: "Средний чек",
    imageUrl:
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1200&q=85",
    description:
      "Грузинская кухня для теплого ужина: хачапури, хинкали и атмосфера, в которой хочется задержаться.",
  },
  {
    id: "lambic",
    title: "Brasserie Lambic",
    category: "food",
    address: "Воронцовская улица, 35Бк2",
    coordinates: { lat: 55.73439, lon: 37.66518 },
    site: "https://lambicbrasserie.ru",
    schedule: "Ежедневно",
    price: "Средний чек",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    description:
      "Бельгийская кухня, напитки и спокойная ресторанная атмосфера для компании или свидания без шаблонов.",
  },
  {
    id: "brooms",
    title: "Brooms на Таганке",
    category: "food",
    address: "Таганская улица, 1с1",
    coordinates: { lat: 55.74173, lon: 37.65386 },
    site: "https://brooms.ru",
    schedule: "Ежедневно",
    price: "Кофе и завтраки",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
    description:
      "Кофе, завтраки и стильная городская посадка, когда хочется начать день красиво и без суеты.",
  },
  {
    id: "blanc",
    title: "Blanc",
    category: "food",
    address: "Хохловский переулок, 7-9с5",
    coordinates: { lat: 55.75818, lon: 37.64632 },
    site: "https://blanc.moscow",
    schedule: "Ежедневно",
    price: "Средний чек",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    description:
      "Модное пространство с двориком, кухней и вечерней атмосферой рядом с историческим центром.",
  },
  {
    id: "illusion",
    title: "Кинотеатр Иллюзион",
    category: "fun",
    address: "Котельническая набережная, 1/15",
    coordinates: { lat: 55.74678, lon: 37.6429 },
    site: "https://gosfilmofond.ru/illusion",
    schedule: "По сеансам",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85",
    description:
      "Культовый кинотеатр с авторским, архивным и фестивальным кино в очень московской локации.",
  },
  {
    id: "moslabirint",
    title: "Мослабиринт",
    category: "fun",
    address: "Таганский район",
    coordinates: { lat: 55.73864, lon: 37.66854 },
    site: "https://moslabirint.ru",
    schedule: "По расписанию",
    price: "По билетам",
    imageUrl:
      "https://images.unsplash.com/photo-1526816229784-65d5d54ac8bc?auto=format&fit=crop&w=1200&q=85",
    description:
      "Квесты, лабиринт и активный формат отдыха для компании, когда хочется не просто сидеть за столом.",
  },
];
