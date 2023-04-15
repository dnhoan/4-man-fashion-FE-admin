import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/app/model/employee.model';
import { SearchOption } from '../model/search-option.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../common-services/request.service';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    public apiEmployee = `${environment.baseUrl}/api/admin`;
    constructor(
        private httpClient: HttpClient,
        private message: NzMessageService,
        private readonly requestService: RequestService
    ) { }

    getAll(search: SearchOption) {
        return this.requestService.get(
            `${this.apiEmployee}/employee/getAll?offset=${search.offset}&limit=${search.limit}`,
            'lấy danh sách nhân viên'
        ).pipe(
            map((res) => {
                if ((res.code = '000')) {
                    return res.data;
                } else {
                    this.message.error('Lỗi lấy danh sách nhân viên');
                    return false;
                }
            })
        );
    }

    public findByStatus(search: SearchOption): Observable<any> {
        return this.requestService.get(
            `${this.apiEmployee}/employee/findByStatus?offset=${search.offset}&limit=${search.limit}&status=${search.status}`,
            'lọc nhân viên theo trạng thái'
        ).pipe(
            map((res) => {
                if ((res.code = '000')) {
                    return res.data;
                } else {
                    this.message.error('Lỗi lấy danh sách nhân viên');
                    return false;
                }
            })
        );
    }

    public getPageEmployee(search: SearchOption) {
        return this.requestService.get(
            `${this.apiEmployee}/employee/findByKey?offset=${search.offset}&limit=${search.limit}&search=${search.searchTerm}`,
            'tìm kiếm nhân viên'
        ).pipe(
            map((res) => {
                if ((res.code = '000')) {
                    return res.data;
                } else {
                    this.message.error('Lỗi tìm kiếm danh sách nhân viên');
                    return false;
                }
            })
        );
    }

    addEmployee(employee: Employee) {
        return this.requestService
            .post(`${this.apiEmployee}/employee/create`, employee, 'tạo mới nhân viên')
            .pipe(
                map((res) => {
                    if (res.code == '000') {
                        this.message.success('Tạo mới nhân viên thành công');
                        return res.data;
                    } else {
                        this.message.error('Lỗi tạo nhân viên');
                        return false;
                    }
                })
            );
    }

    updateEmployee(employee: Employee) {
        return this.requestService
            .put(`${this.apiEmployee}/employee/update`, employee, 'cập nhật nhân viên')
            .pipe(
                map((res) => {
                    if (res.code == '000') {
                        this.message.success('Cập nhật nhân viên thành công');
                        return res.data;
                    } else {
                        this.message.error('Lỗi cập nhật nhân viên');
                        return false;
                    }
                })
            );
    }

    updateStatus(employee: Employee) {
        let action = employee.status == 0 ? 'Xóa' : 'Khôi phục';
        return this.requestService
          .put(`${this.apiEmployee}/employee/update`, employee, action + ' nhân viên')
          .pipe(
            map((res) => {
              if ((res.code = '000')) {
                this.message.success(action + ' nhân viên thành công');
                return res.data;
              } else {
                this.message.error('Lỗi ' + action + ' nhân viên');
                return false;
              }
            })
          );
      }
}
