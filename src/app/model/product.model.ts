import { Material } from './material.model';
import { Category } from './category.model';
import { Models } from './model.model';
import { ProductDetail, ProductDetailDTO } from './productDetail.model';

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
}
