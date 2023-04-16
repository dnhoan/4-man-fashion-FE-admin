import { CustomerDto } from "../dashboard/customer/customerDto.model";
import { ProductDTO } from "./product.model";

export interface FavoriteProduct {
  id?: number;
  customer?: CustomerDto;
  product: ProductDTO;
  status?: number;
  ctime?: string;
}
