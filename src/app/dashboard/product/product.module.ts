import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './productDetail/productDetail.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/share_modules/ng-add-ng-zorro-antd.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  declarations: [ProductDetailComponent, CreateProductComponent],
})
export class ProductModule {}
