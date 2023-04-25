import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../service/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { JwtService } from '../common-services/jwt.service';
import { CommonConstants } from '../constants/common-constants';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private jwtService: JwtService,
    private message: NzMessageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const jwtDecode = this.jwtService.getDecodedAccessToken();

    console.log(jwtDecode);


    let role = jwtDecode.info.authorities[0].authority;

    if (localStorage.getItem(CommonConstants.TOKEN_KEY) && role.includes('ROLE_ADMIN')) {
      // console.log(role);

      return true;
    }
    // not logged in so redirect to login page with the return url
    this.message.error('Bạn phải có quyền Admin mới vào được trang này!'), { queryParams: { returnUrl: state.url } };
    return false;
  }
}
