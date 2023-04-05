export interface Exchange {
  id?: number;
  reason: string;
  exchangeImages: ExchangeImage[];
  ctime?: string;
}
export interface ExchangeImage {
  id?: number;
  image: string;
}
