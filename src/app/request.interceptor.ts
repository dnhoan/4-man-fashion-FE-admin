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

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  token!: string;
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      // this.tokenSevice.getToken() != null &&
      request.url.includes(`${environment.baseUrl}`)
    ) {
      // const tokenInfo = this.tokenSevice.getToken();
      const tokenizedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer '),
      });
      return next.handle(tokenizedReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error['status'] === 403) {
            // this.tokenSevice.removeToken();
            // this.router.navigate(['/login/']);
          }
          return throwError(error);
        })
      );
    }
    return next.handle(request);
  }
}
