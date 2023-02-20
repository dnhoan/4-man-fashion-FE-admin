import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './productDetail/productDetail.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  imports: [
    CommonModule,
    NzDividerModule
  ],
  declarations: [ProductDetailComponent]
})
export class ProductModule { }
