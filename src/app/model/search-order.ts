export interface SearchOrder {
  date?: string[];
  delivery: number;
  purchaseType: number;
  searchTerm: string;
  status: number;
  offset: number;
  limit: number;
  isLoading: boolean;
}
