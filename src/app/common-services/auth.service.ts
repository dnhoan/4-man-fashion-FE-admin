import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
    private router: Router
  ) {}

  login(account: string, password: string) {
    return this.requestService
      .post(`${this.baseUrl}/api/auth/login`, { account, password }, 'login')
      .subscribe((res) => {
        if (res) {
          this.jwtService.setJwtToken(res.token);
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
