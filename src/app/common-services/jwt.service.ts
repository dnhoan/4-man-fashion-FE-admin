import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonConstants } from '../constants/common-constants';
import { ROLE } from '../constants/constant.constant';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(
    private readonly jwtHelper: JwtHelperService,
    private message: NzMessageService,
    private router: Router
  ) {}

  public getJwtToken() {
    return localStorage.getItem(CommonConstants.TOKEN_KEY);
  }

  public setJwtToken(token: string) {
    try {
      let decode = this.jwtHelper.decodeToken(token!);
      if (
        decode.info.authorities[0].authority == ROLE.EMPLOYEE ||
        decode.info.authorities[0].authority == ROLE.ADMIN
      ) {
        localStorage.setItem(CommonConstants.TOKEN_KEY, token);
        this.router.navigate(['/dashboard/product']);
      } else {
        this.message.error('Sai tài khoản hoặc mật khẩu');
      }
    } catch (Error) {}
  }

  public removeJwtToken(): void {
    localStorage.removeItem(CommonConstants.TOKEN_KEY);
  }

  public isTokenExpired(): boolean {
    const token = this.getJwtToken();
    return this.jwtHelper.isTokenExpired(token);
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem(CommonConstants.TOKEN_KEY);

    return token && !this.isTokenExpired() ? true : false;
  }
}
