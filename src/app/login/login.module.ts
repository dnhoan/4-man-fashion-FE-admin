import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../share_modules/ng-add-ng-zorro-antd.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    NgZorroAntdModule,
  ],
})
export class LoginModule {}
