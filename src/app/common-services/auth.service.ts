import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { RequestService } from './request.service';

export interface AccountInfo {
  phoneOrEmail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
    private router: Router,
    private message: NzMessageService
  ) {}

  login(account: AccountInfo) {
    return this.requestService
      .post(`${this.baseUrl}/api/auth/login`, account, 'login')
      .subscribe((res) => {
        if (res.code == '000') {
          this.jwtService.setJwtToken(res.data.token);
        } else this.message.error('Sai tài khoản hoặc mật khẩu');
      });
  }
}
