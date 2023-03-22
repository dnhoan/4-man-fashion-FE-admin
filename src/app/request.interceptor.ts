import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonConstants } from './constants/common-constants';
import { JwtService } from './common-services/jwt.service';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  token!: string;
  constructor(private jwtService: JwtService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      this.jwtService.isLoggedIn() &&
      request.url.includes(`${environment.baseUrl}/api/admin`)
    ) {
      let token = localStorage.getItem(CommonConstants.TOKEN_KEY);

      const tokenizedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(tokenizedReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error['status'] === 403) {
            this.jwtService.isLoggedIn();
            this.router.navigate(['/login/']);
          }
          return throwError(error);
        })
      );
    }
    return next.handle(request);
  }
}
