import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient, private message: NzMessageService) {}

  get<T>(url: string, note: string) {
    return this.http.get<T>(url).pipe(catchError(this.handleError<any>(note)));
  }
  delete<T>(url: string, note: string) {
    return this.http
      .delete<T>(url)
      .pipe(catchError(this.handleError<any>(note)));
  }
  post<T>(url: string, data: any, note: string) {
    return this.http
      .post<T>(url, data)
      .pipe(catchError(this.handleError<any>(note)));
  }
  put<T>(url: string, data: any, note: string) {
    return this.http
      .put<T>(url, data)
      .pipe(catchError(this.handleError<any>(note)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error('Lỗi ' + operation);
      // Let the app keep running by returning an empty result.
      return of({} as T);
    };
  }
}
