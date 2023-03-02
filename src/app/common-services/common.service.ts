import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  pageSizeOptions = [10, 20, 30, 50, 100];
  statuses = [
    { value: 1, label: 'Hoạt động' },
    { value: 0, label: 'Đã xóa' },
    { value: -1, label: 'Tất cả' },
  ];
}
