import { ColorDTO } from './color.model';
import { SizeDTO } from './size.model';
import { ProductDTO } from './product.model';

export interface ProductDetail {
  id?: number;
  productId?: ProductDTO;
  size?: SizeDTO;
  color?: ColorDTO;
  stock?: number;
  productDetailCode?: string;
  price?: number;
  sizeName?: string;
  colorName?: string;
  status?: string;
}

export interface ProductDetailDTO {
  id?: number;
  productId?: ProductDTO;
  size?: SizeDTO;
  color?: ColorDTO;
  stock?: number;
  productDetailCode?: string;
  price?: number;
  colorName?: string;
  sizeName?: string;
  colorName?: string;
  status?: string;
}
