import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { map, of } from "rxjs";
import { environment } from "src/environments/environment";
import { RequestService } from "../common-services/request.service";

@Injectable({
  providedIn: 'root',
})
export class LogOrderStatusService {
  public apiLogOrder = `${environment.baseUrl}/api/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private readonly requestService: RequestService
  ) {}

  getListLogOrder(id: number) {
    return this.requestService
      .get(
        `${this.apiLogOrder}/logOrderStatus/getList?id=${id}`,
        'lấy danh sách trạng thái đơn hàng'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.message.error('Lỗi lấy danh sách trạng thái đơn hàng');
            return false;
          }
        })
      );
  }
}
