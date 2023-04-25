import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../common-services/jwt.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private router: Router,
    private message: NzMessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('auth guard');

    const jwtDecode = this.jwtService.getDecodedAccessToken();
    let role = jwtDecode.info.authorities[0].authority;

    if (this.jwtService.isLoggedIn() && !this.jwtService.isTokenExpired()) {
      if (role.includes('ROLE_USER')) {
        this.message.error('Bạn không có quyền truy cập vào trang này!');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.message.error('Bạn phải đăng nhập mới có thể sử dụng trang này!');
    this.router.navigate(['/login']);
    return false;
  }
}
