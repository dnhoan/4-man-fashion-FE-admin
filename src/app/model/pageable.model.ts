export interface Page {
  totalPages: number;
  totalElement: number;
  offset: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}
