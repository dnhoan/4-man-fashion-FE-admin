import { Material } from './material.model';
import { Category } from './category.model';
import { Models } from './model.model';
import { ProductDetail, ProductDetailDTO } from './productDetail.model';

export interface Product {
  id?: number;
  productId?: number;
  productName?: string;
  description?: String;
  detail?: string;
  materialId?: Material[];
  categoryId?: Category[];
  modelId?: Models[];
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelsName?: string;
  status?: string;
  ctime?: Date;
  mtime?: Date;
  productDetail?: ProductDetailDTO;
}

export interface ProductDTO {
  id?: number;
  productId?: number;
  productName?: string;
  description?: String;
  detail?: string;
  materialId?: Material[];
  categoryId?: Category[];
  modelId?: Models[];
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelsName?: string;
  status?: string;
  ctime?: Date;
  mtime?: Date;
  productDetail?: ProductDetailDTO;
}
