import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './property/category/category.component';
import { ColorComponent } from './property/color/color.component';
import { MaterialComponent } from './property/material/material.component';
import { ModelComponent } from './property/models/model.component';
import { SizeComponent } from './property/size/size.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
