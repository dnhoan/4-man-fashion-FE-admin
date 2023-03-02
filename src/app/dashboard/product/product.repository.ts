import { createStore } from '@ngneat/elf';
import { ProductDTO } from 'src/app/model/product.model';
import { Injectable } from '@angular/core';
import {
  selectAllEntities,
  setEntities,
  withEntities
} from '@ngneat/elf-entities';

export const productsStore = createStore(
  { name: 'products' },
  withEntities<ProductDTO>()
);

@Injectable({ providedIn: 'root' })
export class ProductsRepository {
  products$ = productsStore.pipe(selectAllEntities());

  setProducts(products: ProductDTO[]) {
    productsStore.update(setEntities(products));
  }
}
