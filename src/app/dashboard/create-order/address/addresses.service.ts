import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { Address } from 'src/app/model/address.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  constructor(
    private requestService: RequestService,
    private message: NzMessageService
  ) {}
  getProvinces() {
    return this.requestService
      .get(`${environment.baseProvinces}/api/p/?q=*`, 'lấy địa chỉ')
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.message.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  getDistricts(province_code: number) {
    return this.requestService
      .get(
        `${environment.baseProvinces}/api/d/search/?p=${province_code}&q=*`,
        'lấy địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.message.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  getWards(district_code: number) {
    return this.requestService
      .get(
        `${environment.baseProvinces}/api/w/search/?d=${district_code}&q=*`,
        'lấy địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.message.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
}
