import { EventCategory, GuideItem } from "../types";

const categoryPhoto: Record<EventCategory, string> = {
  sport: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  music: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  theatre: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
  museums: "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=900&q=80",
  food: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  entertainment: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80"
};

function hash(value: string) {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

const curatedPhotos: string[] = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515165562835-c3b8c2f98c76?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80"
];

const photoByTitle: Record<string, string> = {
  "Таганский парк": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "ФОК на Таганке": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
  "Спортивный комплекс «На Таганке»": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  "Веревочный парк": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  "Таганская набережная и Яуза": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "Агломерат": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "Концертный зал Зарядье": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
  "Концертный зал имени Чайковского": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80",
  "Дом музыки": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  "Московский театр на Таганке": "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
  "Музей русской иконы": "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=900&q=80",
  "Бункер-42 на Таганке": "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
  "Дом Высоцкого на Таганке": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
  "Брассери Ламбик": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  "Брумс Таганка": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  "Бланк": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "Иллюзион": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  "Мослабиринт": "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80"
};

export function generatedPlacePhoto(item: GuideItem) {
  if (photoByTitle[item.title]) {
    return photoByTitle[item.title];
  }
  const index = hash(item.id + item.title) % curatedPhotos.length;
  return curatedPhotos[index] || categoryPhoto[item.category];
}

export function getPlacePhoto(item: GuideItem) {
  return generatedPlacePhoto(item);
}
