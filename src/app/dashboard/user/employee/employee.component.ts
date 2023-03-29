import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Employee, EmployeeDTO } from 'src/app/model/employee.model';
import { Page } from 'src/app/model/pageable.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { EmployeeService } from 'src/app/service/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  subSearchEmp!: Subscription;
  searchEmp: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  page!: Page;
  employees: Employee[] = [];
  employee: Employee = {};
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchEmp);

  formEmployee!: FormGroup;
  isVisibleModal = false;
  currentEmp!: number;
  submit = false;
  status!: number;

  constructor(
    private readonly router: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.subSearchEmp = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.employeeService.getAll(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.employees = res.items;
      });

    this.initFormEmployee();
  }

  initFormEmployee() {
    this.formEmployee = this.fb.group({
      id: null,
      employeeName: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],
      image: [''],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      address: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      cccd: ['', [Validators.pattern('^[0-9]{12}$')]],
      salary: [''],
      timeOnboard: [''],
      dayOff: [''],
      note: [''],
      status: [1],
      workType: [1]
    });
  }

  search(value: any) {
    this.searchEmp.searchTerm = value;
    this.searchEmp.offset = 0;
    this.searchChange$.next({ ...this.searchEmp });
  }

  onChangeStatus(status: any) {
    this.searchEmp.status = status;
    this.searchEmp.offset = 0;
    this.searchChange$.next({ ...this.searchEmp });
  }

  onChangeColorPage(event: any) {
    this.searchEmp.limit = event;
    this.searchChange$.next({ ...this.searchEmp });
  }

  onChangeIndexPage(event: any) {
    --event;
    this.searchEmp.offset = event;
    this.searchChange$.next({ ...this.searchEmp });
  }

  showModal(): void {
    this.isVisibleModal = true;
  }

  handleOk(): void {
    this.submit = true;
    if (this.formEmployee.valid) {
      this.saveEmployee();
    }
  }

  handleCancel(): void {
    this.isVisibleModal = false;
    this.currentEmp = -1;
  }

  fillValueForm() {
    let birthdays;
    let timeOnboards;
    let dayOffs;
    if (this.employee.birthday)
      birthdays = this.formatDate(this.employee.birthday);
    else birthdays = null;
    if (this.employee.timeOnboard)
      timeOnboards = this.formatDate(this.employee.timeOnboard);
    else timeOnboards = null;
    if (this.employee.dayOff)
      dayOffs = this.formatDate(this.employee.dayOff);
    else dayOffs = null;
    this.formEmployee.patchValue({
      id: this.employee.id,
      employeeCode: this.employee.employeeCode,
      employeeName: this.employee.employeeName,
      image: this.employee.image,
      phoneNumber: this.employee.phoneNumber,
      address: this.employee.address,
      birthday: birthdays,
      gender: this.employee.gender,
      email: this.employee.email,
      cccd: this.employee.cccd,
      salary: this.employee.salary,
      timeOnboard: timeOnboards,
      dayOff: dayOffs,
      note: this.employee.note,
      status: this.employee.status,
      workType: this.employee.workType
    });
  }

  addValueEmployee() {
    this.employee.id = this.formEmployee.value.id;
    this.employee.employeeCode = this.formEmployee.value.employeeCode;
    this.employee.employeeName = this.formEmployee.value.employeeName;
    this.employee.image = this.formEmployee.value.image;
    this.employee.phoneNumber = this.formEmployee.value.phoneNumber;
    this.employee.address = this.formEmployee.value.address;
    this.employee.birthday = this.formEmployee.value.birthday;
    this.employee.gender = this.formEmployee.value.gender;
    this.employee.email = this.formEmployee.value.email;
    this.employee.cccd = this.formEmployee.value.cccd;
    this.employee.salary = this.formEmployee.value.salary;
    this.employee.timeOnboard = this.formEmployee.value.timeOnboard;
    this.employee.note = this.formEmployee.value.note;
    this.employee.status = this.formEmployee.value.status;
    this.employee.workType = this.formEmployee.value.workType
  }

  getInfoEmployee(id: any) {
    this.currentEmp = id;
    this.showModal();
    const employeeByID = this.employees.find((value) => {
      return value.id == id;
    });
    if (employeeByID) {
      this.employee = employeeByID;
    }
    this.fillValueForm();
  }

  saveEmployee() {
    this.addValueEmployee();
    if (this.employee.id) {
      this.updateEmployee(this.employee);
      return;
    }
    this.createEmployee(this.employee);
  }

  createEmployee(employee: Employee) {
    this.employeeService.addEmployee(employee)
      .subscribe((res) => {
        if (res) {
          this.employees.unshift(res);
          this.isVisibleModal = false;
        }
      });
  }

  updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(employee)
      .subscribe((res) => {
        if (res) {
          this.employees[this.currentEmp - 1] = res;
        }
      });
    this.isVisibleModal = false;
  }

  deleteEmployee(id: any) {
    this.employeeService.deleteEmployee(id)
  }

  restoreEmployee(id: any) {
    this.employeeService.restoreEmployee(id);
  }

  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  reFormatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}
