import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Account, AccountDTO } from 'src/app/model/account.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  formAcc!: FormGroup;
  subSearchAccount!: Subscription;
  searchAccount: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  submit = false;
  page!: Page;
  accounts: AccountDTO[] = [];
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchAccount);
  isVisibleModal = false;
  inputEmail: string = '';
  inputPhoneNumber: string = '';
  inputPassword: string = '';
  inputRole: number = 1;
  currentAccount!: number;
  accountDTO: AccountDTO = {};
  constructor(
    private accountService: AccountService,
    public commonService: CommonService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllAccount();
  }
  search(value: any) {
    this.searchAccount.searchTerm = value;
    this.searchAccount.offset = 0;
    this.searchChange$.next({ ...this.searchAccount });
  }
  onChangeStatus(status: any) {
    this.searchAccount.status = status;
    this.searchAccount.offset = 0;
    this.searchChange$.next({ ...this.searchAccount });
  }
  onChangeAccountPage(event: any) {
    this.searchAccount.limit = event;
    this.searchChange$.next({ ...this.searchAccount });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchAccount.offset = event;
    this.searchChange$.next({ ...this.searchAccount });
  }

  getAllAccount() {
    this.subSearchAccount = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.accountService.getAllAccount(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.accounts = res.items;
      });
  }

  showModal(): void {
    this.submit = false;
    this.formAcc = this.fb.group({
      id: null,
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=[^A-Z\\n]*[A-Z])(?=[^a-z\\n]*[a-z])(?=[^0-9\\n]*[0-9]).{6,}$'
          ),
        ],
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      role: [1, [Validators.required]],
      status: [1, [Validators.required]],
    });
    this.isVisibleModal = true;
  }

  handleOk() {
    this.submit = true;
    this.saveAccount();
  }

  saveAccount() {
    this.addValueAccount();
    if (this.formAcc.value.id) {
      this.updateAccount();
    }
    if (!this.formAcc.value.id) {
      this.addAccount(this.accountDTO);
    }
  }

  getInfoAccount(account: AccountDTO) {
    this.showModal();
    const accountByID = this.accounts.find((value) => {
      return value == account;
    });
    if (accountByID) {
      this.accountDTO = accountByID;
    }
    this.fillValueForm();
  }

  addValueAccount() {
    this.accountDTO.id = this.formAcc.value.id;
    this.accountDTO.email = this.formAcc.value.email;
    if (this.formAcc.value.id == null) {
      this.accountDTO.password = this.formAcc.value.password;
    } else {
      this.accountDTO.password = this.accountDTO.password;
    }
    this.accountDTO.phoneNumber = this.formAcc.value.phoneNumber;
    this.accountDTO.role = { id: this.formAcc.value.role };
    if (this.formAcc.value.status == 1) {
      this.accountDTO.status = 1;
    } else {
      this.accountDTO.status = 0;
    }
  }

  addAccount(account: AccountDTO) {
    this.accountService.createAcoount(account).subscribe(
      (res) => {
        if (res.code === '000') {
          this.isVisibleModal = false;
          this.message.success('Tạo tài khoản thành công!');
        } else {
          this.isVisibleModal = true;
          this.message.error(`${res.desc}`);
        }
        this.getAllAccount();
        return;
      }
    );
  }

  updateAccount() {
    let value = this.formAcc.value;
    let data = (this.accountDTO = {
      email: value.email,
      phoneNumber: value.phoneNumber,
      password: this.accountDTO.password,
      role: value.role,
    });
    this.addValueAccount();
    this.accountService.updateAccount(this.accountDTO).subscribe((res) => {
      if (res.code === '000') {
        this.isVisibleModal = false;
        this.message.success('Cập nhật tài khoản thành công!');
      } else {
        this.isVisibleModal = true;
        this.message.error(`${res.desc}`);
      }
      this.getAllAccount();
      return;
    });
  }

  fillValueForm() {
    this.formAcc.patchValue({
      id: this.accountDTO.id,
      email: this.accountDTO.email,
      phoneNumber: this.accountDTO.phoneNumber,
      password: this.accountDTO.password,
      status: this.accountDTO.status,
      role: this.accountDTO.role!.id,
    });
  }

  handleCancel(): void {
    this.currentAccount = -1;
    this.isVisibleModal = false;
  }

  updateStatus(accountDTO: AccountDTO, index: number, status: number) {
    this.modal.confirm({
      nzTitle:
        'Bạn có muốn ' +
        (status == 0 ? 'xóa' : 'khôi phục') +
        ' tài khoản này không?',
      nzOnOk: () => {
        this.accountService
          .updateStatus({ ...accountDTO, status })
          .subscribe((res) => {
            if (res) {
              if (this.searchAccount.status == -1) {
                this.accounts[index] = res;
              } else {
                this.accounts.splice(index, 1);
              }
            }
          });
      },
    });
  }
}
