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
import { CustomerComponent } from './customer/customer.component';
import { ReportComponent } from './report/report.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'color',
        component: ColorComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'size',
        component: SizeComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'material',
        component: MaterialComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'model',
        component: ModelComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'voucher',
        component: VoucherComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'order/:order_id',
        component: CreateOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orders',
        component: OrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'customer',
        component: CustomerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AdminGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
