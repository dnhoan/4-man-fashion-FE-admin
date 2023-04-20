import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { NgZorroAntdModule } from '../share_modules/ng-add-ng-zorro-antd.module';
import { CategoryComponent } from './property/category/category.component';
import { ColorComponent } from './property/color/color.component';
import { MaterialComponent } from './property/material/material.component';
import { SizeComponent } from './property/size/size.component';
import { ModelComponent } from './property/models/model.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { QuillModule } from 'ngx-quill';
import { VoucherComponent } from './voucher/voucher/voucher.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { EmployeeComponent } from './user/employee/employee.component';
import { OrderDetailComponent } from './order/orderDetail/orderDetail.component';
import { OrderComponent } from './order/order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { AddressComponent } from './create-order/address/address.component';
import { DeliveryComponent } from './create-order/delivery/delivery.component';
import { CustomerInfoComponent } from './create-order/customer-info/customer-info.component';
import { CustomerComponent } from './customer/customer.component';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { OrderStatusPipe } from '../pipes/order-status.pipe';
import { FavoriteProductComponent } from './favorite-product/favorite-product.component';
import { ExchangeOnlineComponent } from './create-order/exchange-online/exchange-online.component';
import { ReturnOrderComponent } from './create-order/return-order/return-order.component';
import { ExchangeStoreComponent } from './create-order/exchange-store/exchange-store.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductComponent,
    CategoryComponent,
    ColorComponent,
    VoucherComponent,
    MaterialComponent,
    SizeComponent,
    ModelComponent,
    CreateProductComponent,
    UpdateProductComponent,
    AccountComponent,
    EmployeeComponent,
    OrderComponent,
    FavoriteProductComponent,
    DeliveryComponent,
    AddressComponent,
    CreateOrderComponent,
    OrderDetailComponent,
    CustomerInfoComponent,
    CustomerComponent,
    OrderStatusPipe,
    ExchangeOnlineComponent,
    ReturnOrderComponent,
    ExchangeStoreComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NzTimelineModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ],

  providers: [],
})
export class DashboardModule {}
