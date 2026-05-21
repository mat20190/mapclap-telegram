export const categoryLabels = {
  all: "Все",
  sport: "Спорт",
  music: "Музыка",
  theatre: "Театр",
  museums: "Музеи",
  food: "Еда",
  entertainment: "Развлечения"
};

export const categoryColors = {
  sport: "#7bc99a",
  music: "#8db7ff",
  theatre: "#ffb1c0",
  museums: "#f0c36d",
  food: "#ff9b73",
  entertainment: "#b9a7ff"
};

export const places = [
  {
    id: "tagansky-park",
    title: "Таганский парк",
    category: "sport",
    address: "ул. Таганская, 40-42",
    description: "Зеленый парк для прогулок, пробежек, воркаута и катка зимой.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    site: "https://taganskypark.ru/",
    price: "бесплатно",
    schedule: "ежедневно",
    coordinates: { lat: 55.735, lon: 37.665 }
  },
  {
    id: "aglo",
    title: "Агломерат",
    category: "music",
    address: "Костомаровский пер., 3",
    description: "Альтернативная концертная площадка с плотной вечерней атмосферой.",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    site: "https://aglo.moscow/",
    price: "по афише",
    schedule: "вечерние события",
    coordinates: { lat: 55.753, lon: 37.661 }
  },
  {
    id: "zaryadye",
    title: "Концертный зал Зарядье",
    category: "music",
    address: "ул. Варварка, 6",
    description: "Современная акустика, симфонические концерты и сильная культурная программа.",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
    site: "https://zaryadyehall.com/",
    price: "по афише",
    schedule: "по расписанию",
    coordinates: { lat: 55.751, lon: 37.628 }
  },
  {
    id: "taganka-theatre",
    title: "Московский театр на Таганке",
    category: "theatre",
    address: "ул. Земляной Вал, 76/21",
    description: "Легендарная сцена района и один из главных культурных символов Таганки.",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80",
    site: "https://tagankateatr.ru/",
    price: "по афише",
    schedule: "по расписанию",
    coordinates: { lat: 55.742, lon: 37.653 }
  },
  {
    id: "russian-icons",
    title: "Музей русской иконы",
    category: "museums",
    address: "ул. Гончарная, 3",
    description: "Камерный музей с сильной коллекцией и спокойным внимательным настроением.",
    imageUrl: "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=1000&q=80",
    site: "https://www.russikona.ru/",
    price: "билет",
    schedule: "ежедневно",
    coordinates: { lat: 55.747, lon: 37.655 }
  },
  {
    id: "bunker-42",
    title: "Бункер-42 на Таганке",
    category: "museums",
    address: "5-й Котельнический пер., 11",
    description: "Подземный музей времен холодной войны и необычная экскурсия в центре.",
    imageUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1000&q=80",
    site: "https://bunker42.com/",
    price: "билет",
    schedule: "по расписанию",
    coordinates: { lat: 55.741, lon: 37.649 }
  },
  {
    id: "lambic",
    title: "Брассери Ламбик",
    category: "food",
    address: "Таганский район",
    description: "Еда, уютный зал и понятный вариант для встречи в центре.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    site: "https://lambicbar.ru/",
    price: "средний чек",
    schedule: "ежедневно",
    coordinates: { lat: 55.742, lon: 37.657 }
  },
  {
    id: "illusion",
    title: "Кинотеатр Иллюзион",
    category: "entertainment",
    address: "Котельническая наб., 1/15",
    description: "Авторское кино, классика и красивый маршрут на вечер.",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
    site: "https://gosfilmofond.ru/cinema/illusion/",
    price: "билет",
    schedule: "по афише",
    coordinates: { lat: 55.745, lon: 37.653 }
  }
];
