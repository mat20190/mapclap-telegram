export type EventCategory =
  | "sport"
  | "music"
  | "theatre"
  | "museums"
  | "food"
  | "entertainment";

export type AudienceMode = "users" | "business";

export type GuideItem = {
  id: string;
  title: string;
  category: EventCategory;
  kind: "place" | "event";
  venue: string;
  address: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  videoUrl?: string;
  sourceUrl?: string;
  vibe: string;
  advisorNote: string;
  matchScore: number;
  tags: string[];
  price: string;
  schedule: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export type BusinessPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
};
