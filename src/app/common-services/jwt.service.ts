import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonConstants } from '../constants/common-constants';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private readonly jwtHelper: JwtHelperService) {}

  public getJwtToken() {
    return localStorage.getItem(CommonConstants.TOKEN_KEY);
  }

  public setJwtToken(token: string) {
    localStorage.setItem(CommonConstants.TOKEN_KEY, token);
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
    console.log('token');

    return token ? true : false;
  }
}
