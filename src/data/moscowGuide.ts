import { EventCategory, GuideItem } from "../types";

export const categoryLabels: Record<EventCategory, string> = {
  sport: "Спорт",
  music: "Музыка",
  theatre: "Театр",
  museums: "Музеи",
  food: "Еда",
  entertainment: "Развлечения"
};

export const categoryColors: Record<EventCategory, string> = {
  sport: "#2f7d5f",
  music: "#7b4bb3",
  theatre: "#b34343",
  museums: "#3d6fb6",
  food: "#c2732e",
  entertainment: "#ba4f86"
};

export const corgiAdvisor = {
  name: "Клэп",
  imageUrl:
    "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=420&q=80",
  line:
    "Я смотрю на район, настроение, бюджет и компанию, а потом собираю места без случайных рекомендаций."
};

const img = {
  taganskyPark:
    "https://commons.wikimedia.org/wiki/Special:FilePath/TaganskyPark.jpg",
  park:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  sport:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  aglomerat:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  zaryadye:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Zaryadye%20Concert%20Hall%20%282018%29.jpg",
  tchaikovsky:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tchaikovsky%20Concert%20Hall.jpg",
  music:
    "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=900&q=80",
  domMuzyki:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Moscow%20International%20House%20of%20Music.jpg",
  tagankaTheatre:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Taganka-theatre.jpg",
  actors:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Actors%20Taganka-Theatre.jpg",
  theatre:
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80",
  russianIcons:
    "https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=900&q=80",
  bunker:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bunker%2042.jpg",
  vysotsky:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vysotsky-House%20Taganka%281%29.jpg",
  museum:
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  food:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  cafe:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  bar:
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  cinema:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Moscow%2C%20Illusion%20cinema%20entrance%20%2830952844952%29.jpg"
};

function makePlace(
  id: string,
  title: string,
  category: EventCategory,
  venue: string,
  address: string,
  description: string,
  imageUrl: string,
  coordinates: { latitude: number; longitude: number },
  vibe: string,
  tags: string[],
  price = "уточнять",
  schedule = "проверять перед визитом",
  sourceUrl?: string
): GuideItem {
  return {
    id,
    title,
    category,
    kind: "place",
    venue,
    address,
    description,
    imageUrl,
    gallery: [imageUrl, img.cafe, img.park],
    vibe,
    advisorNote: `Клэп добавляет ${title} в подборку, если настроение: ${vibe}.`,
    matchScore: 86,
    tags,
    price,
    schedule,
    coordinates,
    sourceUrl
  };
}

export const moscowGuideItems: GuideItem[] = [
  makePlace("taganskiy-park", "Taganskiy Park", "sport", "Таганский парк", "ул. Таганская, 40-42", "Беговые дорожки, воркаут, каток зимой и атмосферные прогулки.", img.taganskyPark, { latitude: 55.735, longitude: 37.665 }, "активно и рядом", ["парк", "воркаут", "каток"], "бесплатно", "каждый день"),
  makePlace("fok-taganka", "ФОК на Таганке", "sport", "ФОК на Таганке", "Таганский район", "Бассейн, тренажерный зал и спортивные секции для регулярных занятий.", img.sport, { latitude: 55.7398, longitude: 37.6573 }, "регулярный спорт", ["бассейн", "зал", "секции"]),
  makePlace("sport-complex-taganka", "Спортивный комплекс «На Таганке»", "sport", "Спорткомплекс", "Таганский район", "Универсальный спортивный комплекс для тренировок и секций.", img.sport, { latitude: 55.7402, longitude: 37.656 }, "тренировка", ["спорткомплекс", "секции", "зал"]),
  makePlace("verevochnyy-park", "Verevochnyy Park", "sport", "Веревочный парк", "Таганский район", "Активный отдых, веревочные маршруты и формат для компании.", img.park, { latitude: 55.7362, longitude: 37.6639 }, "активный отдых", ["веревочный парк", "компания", "активно"]),
  makePlace("taganka-yauza", "Таганская набережная и Яуза", "sport", "Яуза", "Яузская наб.", "Маршрут для пробежек, велосипедов и прогулок вдоль воды.", img.park, { latitude: 55.7462, longitude: 37.6471 }, "движение у воды", ["бег", "велосипед", "набережная"], "бесплатно", "каждый день"),
  makePlace("novospassky-square", "Сквер у Новоспасского монастыря", "sport", "Сквер", "Крестьянская пл., 10", "Спокойное место для утренних тренировок и прогулок.", img.park, { latitude: 55.7311, longitude: 37.6569 }, "спокойная тренировка", ["сквер", "утро", "прогулка"], "бесплатно", "каждый день"),

  makePlace("aglomerat", "Aglomerat", "music", "Aglomerat", "Костомаровский пер., 3с12", "Популярная альтернативная концертная площадка Москвы.", img.aglomerat, { latitude: 55.7556, longitude: 37.6672 }, "альтернативная сцена", ["концерты", "альтернатива", "вечер"], "по афише", "по афише", "https://www.aglomerat.org/"),
  makePlace("zaryadye-hall", "Concert Hall Zaryadye", "music", "Зарядье", "ул. Варварка, 6с4", "Современный концертный зал с топовой акустикой и симфоническими концертами.", img.zaryadye, { latitude: 55.751, longitude: 37.628 }, "сильная акустика", ["концерт", "симфония", "центр"], "по афише", "по расписанию"),
  makePlace("tchaikovsky-hall", "Tchaikovsky Concert Hall", "music", "Зал Чайковского", "Триумфальная пл., 4/31", "Классика московской музыкальной сцены.", img.tchaikovsky, { latitude: 55.7701, longitude: 37.5967 }, "классический вечер", ["классика", "зал", "музыка"], "по афише", "по расписанию"),
  makePlace("moskontsert", "Moskontsert", "music", "Москонцерт", "Москва", "Джаз, камерная музыка и авторские вечера.", img.music, { latitude: 55.7617, longitude: 37.6149 }, "камерная музыка", ["джаз", "камерно", "вечер"], "по афише", "по афише"),
  makePlace("powerhouse", "Клуб Powerhouse Moscow", "music", "Powerhouse", "Гончарная ул., 7/4с1", "Камерные концерты, электронная сцена и барная атмосфера.", img.music, { latitude: 55.7439, longitude: 37.6495 }, "музыка и бар", ["бар", "электроника", "концерты"], "по меню/афише", "вечерами"),
  makePlace("dom-muzyki", "Дом музыки", "music", "ММДМ", "Космодамианская наб., 52с8", "Крупные выступления рядом с Таганкой и набережной.", img.domMuzyki, { latitude: 55.7334, longitude: 37.6447 }, "музыка у воды", ["концерт", "набережная", "зал"], "по афише", "по расписанию"),

  makePlace("theatre-taganka", "Moskovskiy Teatr Na Taganke", "theatre", "Театр на Таганке", "ул. Земляной Вал, 76/21", "Легендарный театр Высоцкого и Любимова.", img.tagankaTheatre, { latitude: 55.7425, longitude: 37.6536 }, "легендарная сцена", ["театр", "Высоцкий", "Любимов"], "по афише", "по расписанию"),
  makePlace("teatr-experiment", "Teatr", "theatre", "Teatr", "Москва", "Современная экспериментальная площадка.", img.theatre, { latitude: 55.748, longitude: 37.64 }, "эксперимент", ["театр", "эксперимент", "сцена"], "по афише", "по афише"),
  makePlace("actors-taganka", "Театр «Содружество актёров Таганки»", "theatre", "Содружество актёров Таганки", "ул. Земляной Вал, 76/21с1", "Продолжение традиций старой Таганки.", img.actors, { latitude: 55.7421, longitude: 37.6533 }, "театральная традиция", ["театр", "Таганка", "сцена"], "по афише", "по расписанию"),
  makePlace("pokrovka-theatre", "Театр на Покровке", "theatre", "Театр на Покровке", "ул. Покровка", "Камерные постановки и уютная театральная атмосфера.", img.theatre, { latitude: 55.7595, longitude: 37.6469 }, "камерный театр", ["театр", "камерно", "постановки"], "по афише", "по расписанию"),
  makePlace("cdr", "Центр драматургии и режиссуры", "theatre", "ЦДР", "Москва", "Современная драма и режиссерские эксперименты.", img.theatre, { latitude: 55.7657, longitude: 37.6078 }, "современная драма", ["драма", "режиссура", "театр"], "по афише", "по афише"),
  makePlace("teatr-doc", "Театр.doc", "theatre", "Театр.doc", "Москва", "Культовое независимое театральное пространство.", img.theatre, { latitude: 55.771, longitude: 37.61 }, "независимый театр", ["театр", "док", "независимо"], "по афише", "по афише"),

  makePlace("russian-icons", "Museum of Russian Icons", "museums", "Музей русской иконы", "ул. Гончарная, 3с1", "Один из лучших частных музеев Москвы с большой коллекцией икон.", img.russianIcons, { latitude: 55.7454, longitude: 37.6477 }, "тихое искусство", ["музей", "иконы", "коллекция"], "уточнять", "проверять", "http://www.russikona.ru"),
  makePlace("sobranie", "Музей «Собрание» Давида Якобашвили", "museums", "Собрание", "Москва", "Коллекция автоматонов, часов и музыкальных механизмов.", img.museum, { latitude: 55.744, longitude: 37.642 }, "редкая коллекция", ["музей", "автоматы", "механизмы"], "по билетам", "проверять"),
  makePlace("bunker42", "Bunker-42 on Taganka", "museums", "Бункер-42", "5-й Котельнический пер., 11", "Настоящий бункер времен холодной войны.", img.bunker, { latitude: 55.7414, longitude: 37.6493 }, "секретная Москва", ["бункер", "музей", "экскурсия"], "по билетам", "по сеансам", "https://bunker42.com"),
  makePlace("vysotsky", "Vladimir Vysotskiy Museum & Center", "museums", "Дом Высоцкого", "ул. Высоцкого, 3с1", "Атмосфера старой Таганки и Высоцкого.", img.vysotsky, { latitude: 55.7412, longitude: 37.6553 }, "легенда района", ["Высоцкий", "музей", "Таганка"], "по билетам", "проверять"),
  makePlace("here-gallery", "Here Gallery", "museums", "Here Gallery", "Москва", "Современное искусство и выставки.", img.museum, { latitude: 55.752, longitude: 37.641 }, "современное искусство", ["галерея", "выставки", "арт"], "уточнять", "по афише"),
  makePlace("korin-house", "Дом-музей П. Д. Корина", "museums", "Дом-музей П. Д. Корина", "Москва", "Атмосферное место с древнерусским искусством.", img.museum, { latitude: 55.745, longitude: 37.636 }, "атмосферный музей", ["музей", "искусство", "дом-музей"], "по билетам", "проверять"),

  makePlace("megreliya", "Megreliya", "food", "Megreliya", "Таганский район", "Грузинская точка района для ужина и компании.", img.food, { latitude: 55.742, longitude: 37.656 }, "грузинский ужин", ["грузинская кухня", "ужин", "компания"], "по меню", "каждый день"),
  makePlace("brasserie-lambic", "Brasserie Lambic", "food", "Brasserie Lambic", "Таганский район", "Бельгийская кухня и приятная атмосфера.", img.bar, { latitude: 55.741, longitude: 37.654 }, "бельгийский вечер", ["бельгийская кухня", "бар", "ужин"], "по меню", "каждый день"),
  makePlace("gambrinus", "Гамбринус на Таганке", "food", "Гамбринус", "Таганский район", "Классическое место для компании.", img.bar, { latitude: 55.7424, longitude: 37.6551 }, "компания", ["бар", "компания", "ужин"], "по меню", "каждый день"),
  makePlace("brooms-taganka", "Brooms Таганка", "food", "Brooms", "Таганский район", "Стильное кафе для завтраков и кофе.", img.cafe, { latitude: 55.7408, longitude: 37.657 }, "завтрак и кофе", ["кофе", "завтрак", "кафе"], "по меню", "каждый день"),
  makePlace("rogalik", "Рогалик", "food", "Рогалик", "Таганский район", "Популярная пекарня и десерты.", img.cafe, { latitude: 55.743, longitude: 37.651 }, "сладкая пауза", ["пекарня", "десерты", "кофе"], "по меню", "каждый день"),
  makePlace("blanc", "Blanc", "food", "Blanc", "Хохловский пер., 7-9с2", "Модное пространство с двориком и вечерней атмосферой.", img.food, { latitude: 55.755, longitude: 37.6442 }, "дворик в центре", ["ресторан", "дворик", "вечер"], "по меню", "каждый день"),

  makePlace("moslabirint", "Moslabirint", "entertainment", "Moslabirint", "Москва", "Большой лабиринт и квест-зоны.", img.park, { latitude: 55.748, longitude: 37.65 }, "квест и игра", ["квест", "лабиринт", "компания"], "по билетам", "по расписанию"),
  makePlace("illusion", "Кинотеатр «Иллюзион»", "entertainment", "Иллюзион", "Котельническая наб., 1/15", "Культовое место с авторским кино.", img.cinema, { latitude: 55.7466, longitude: 37.6427 }, "кино с историей", ["кино", "авторское", "высотка"], "по билетам", "по расписанию")
];
