import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './productDetail/productDetail.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgZorroAntdModule } from 'src/app/share_modules/ng-add-ng-zorro-antd.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    NzDividerModule,
    NzDrawerModule,
    ReactiveFormsModule,
    NzGridModule,
    FormsModule,
    NzFormModule,
    NzLayoutModule,
    NzDropDownModule,
    NzIconModule,
    NzTableModule,
    NzSelectModule,
    NgZorroAntdModule,
    NzDividerModule,
    NzSpaceModule,
    NzPaginationModule,
    NzBreadCrumbModule,
  ],
  declarations: []
})
export class ProductModule {}
