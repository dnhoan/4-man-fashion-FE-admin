import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/common-services/common.service';
import { CustomerService } from 'src/app/dashboard/customer/customer.service';
import { Customer } from 'src/app/dashboard/customer/customerDto.model';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  formCustomer!: FormGroup;
  submit = false;
  constructor(
    private customerService: CustomerService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.formCustomer = this.fb.group({
      id: null,
      customerName: ['', [Validators.required]],
      gender: [1],
      birthday: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      note: [''],
    });
  }
  handleOk() {
    this.submit = true;
    if (this.formCustomer.valid) {
      let value = this.formCustomer.value;
      this.customerService.createCustomer(value).subscribe((res) => {
        if (res.code == '000') {
          this.modalRef.destroy(res.data.customer);
        } else if (res.code == '409') {
          this.message.error(res.desc);
        } else {
          this.message.error('Lỗi tạo khách hàng');
        }
      });
    }
  }

  handleCancel() {
    this.modalRef.destroy(false);
  }
}
