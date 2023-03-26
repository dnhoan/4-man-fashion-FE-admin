import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonConstants {
  public static readonly TOKEN_KEY = 'token';
  public static readonly STATUS = {
    ACTIVE: 1,
    INACTIVE: 0,
  };
  public static readonly DELIVERY_STATUS = {
    DELIVERY: 1,
    NON_DELIVERY: 0,
  };
}
