import { GuideItem } from "../types";

const russianTitleBySourceTitle: Record<string, string> = {
  "Taganskiy Park": "Таганский парк",
  "Verevochnyy Park": "Веревочный парк",
  Aglomerat: "Агломерат",
  "Concert Hall \"Zaryad'ye\"": "Концертный зал Зарядье",
  "Concert Hall Zaryad'ye": "Концертный зал Зарядье",
  "Tchaikovsky Concert Hall": "Концертный зал имени Чайковского",
  Moskontsert: "Москонцерт",
  "Moskovskiy Teatr Na Taganke": "Московский театр на Таганке",
  Teatr: "Театр",
  "Museum of Russian Icons": "Музей русской иконы",
  "Bunker-42 on Taganka": "Бункер-42 на Таганке",
  "Vladimir Vysotskiy Museum & Center": "Дом Высоцкого на Таганке",
  "Here Gallery": "Галерея Здесь",
  Megreliya: "Мегрелия",
  "Brasserie Lambic": "Брассери Ламбик",
  "Brooms Таганка": "Брумс Таганка",
  Blanc: "Бланк",
  Moslabirint: "Мослабиринт"
};

export function getPlaceTitle(item: GuideItem) {
  return russianTitleBySourceTitle[item.title] || item.title;
}
