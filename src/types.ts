export interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  demographic: string;
  rating: number | null;
  rating_count: number;
  zip: string;
  dma: string;
}

export interface ZoneInsights {
  avg_rating: number;
  store_count: number;
  top_types: [string, number][];
  demographic: string;
  trends: {
    [storeType: string]: string[];
  };
}

export interface PersonalizedMessage {
  welcome: string;
  insight: string;
  opportunity: string;
}

export interface FormData {
  storeName: string;
  address: string;
  storeType: string;
  ownerName: string;
  contactMethod: string;
  lat?: number;
  lng?: number;
  zip?: string;
  products: string[];
  excitement: string;
  contactPreference: string[];
  timePreference: string;
}
