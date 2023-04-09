export interface Exchange {
  id?: number;
  reason: string;
  exchangeImages: ExchangeImage[];
  orderDetailIdOrigin: number;
  note?: string;
  ctime?: string;
}
export interface ExchangeImage {
  id?: number;
  image: string;
}
