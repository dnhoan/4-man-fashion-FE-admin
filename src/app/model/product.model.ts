import { Material } from './material.model';
import { Category } from './category.model';
import { Models } from './model.model';
import { ProductDetail, ProductDetailDTO } from './productDetail.model';
import { Size } from './size.model';
import { Color } from './color.model';

export interface Product {
  id: number;
  productId: number;
  productName?: string;
  description?: String;
  detail?: string;
  material?: Material;
  category?: Category;
  model?: Models;
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelName?: string;
  status?: number;
  ctime?: Date;
  mtime?: Date;
  expand?: boolean;
  productImages?: {
    id?: number;
    image: string;
  }[];
  productDetails: ProductDetail[];
}

export interface ProductDTO {
  id: number;
  productId: number;
  productName?: string;
  description?: String;
  detail?: string;
  material?: Material;
  category?: Category;
  model?: Models;
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelName?: string;
  status?: number;
  ctime?: Date;
  mtime?: Date;
  expand?: boolean;
  productImages?: {
    id?: number;
    image: string;
  }[];
  productDetails: ProductDetailDTO[];
  sizeSelected?: Size;
  colorSelected?: Color;
  productDetailSelected?: ProductDetailDTO;
  sizes?: Size[];
  minPrice?: number;
  maxPrice?: number;
  colors?: Color[];
  amount?: number;
  stock?: number;
}
