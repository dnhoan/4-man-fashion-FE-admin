import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';
import { Account, AccountDTO } from '../model/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  public apiAccount = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getAllAccount(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiAccount}/account/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách tài khoản'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách tài khoản');
            return false;
          }
        })
      );
  }

  getListAccount(): Observable<any> {
    return this.httpClient.get<any>(this.apiAccount + '/account/getList');
  }

  createAcoount(account: AccountDTO) {
    return this.requestService
      .post(`${this.apiAccount}/account/create`, account, 'tạo mới tài khoản')
      .pipe(
        map((res) => {
          if ((res.code === '000')) {
            return res;
          } else {
            return res;
          }
        })
      );
  }

  updateAccount(account: Account) {
    return this.requestService
      .put(`${this.apiAccount}/account/update`, account, 'cập nhật tài khoản')
      .pipe(
        map((res) => {
          if ((res.code === '000')) {
            return res;
          } else {
            return res;
          }
        })
      );
  }

  updateStatus(accountDTO: AccountDTO) {
    let action = accountDTO.status == 0 ? 'Xóa' : 'Khôi phục';
    return this.requestService
      .put(`${this.apiAccount}/account/update`, accountDTO, action + ' size')
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success(action + ' tài khoản thành công');
            return res.data;
          } else {
            this.message.error('Lỗi ' + action + ' size');
            return false;
          }
        })
      );
  }
}
