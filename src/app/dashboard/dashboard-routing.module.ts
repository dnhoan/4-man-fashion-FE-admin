import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { DashboardComponent } from './dashboard.component';
import { OrderComponent } from './order/order.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './property/category/category.component';
import { ColorComponent } from './property/color/color.component';
import { MaterialComponent } from './property/material/material.component';
import { ModelComponent } from './property/models/model.component';
import { SizeComponent } from './property/size/size.component';
import { VoucherComponent } from './voucher/voucher/voucher.component';
import { EmployeeComponent } from './user/employee/employee.component';
import { FavoriteProductComponent } from './favorite-product/favorite-product.component';
import { AccountComponent } from './account/account.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
      },
      {
        path: 'color',
        component: ColorComponent,
      },
      {
        path: 'size',
        component: SizeComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'material',
        component: MaterialComponent,
      },
      {
        path: 'model',
        component: ModelComponent,
      },
      {
        path: 'voucher',
        component: VoucherComponent,
      },
      {
        path: 'employee',
        component: EmployeeComponent,
      },
      {
        path: 'order/:order_id',
        component: CreateOrderComponent,
      },
      {
        path: 'orders',
        component: OrderComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
