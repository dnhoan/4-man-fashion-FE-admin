import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Color, ColorDTO } from 'src/app/model/color.model';
import { ColorService } from 'src/app/service/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
  formColor!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  color: Color = {};
  datas: ColorDTO[] = [];
  sortBy = 'colorName';
  descAsc = 'desc';
  offset = 0;
  limit = 5;
  Page: any;
  isVisible = false;
  action = true;
  submit = false;
  status = 1;
  disable = false;
  constructor(
    private readonly router: Router,
    private message: NzMessageService,
    private colorService: ColorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.submit = false;
    this.formColor = this.fb.group({
      id: null,
      colorCode: ['', [Validators.required]],
      colorName: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk() {
    this.submit = true;
    if (this.formColor.valid) {
      this.saveColor();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  saveColor() {
    if (this.color.id) {
      this.updateColor();
      return;
    }
    this.addColor(this.color);
  }

  getAllColor() {
    this.colorService
      .getAllColor(this.offset, this.limit, this.status)
      .subscribe((res: any) => {
        this.datas = res.data.items;
      });
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.colorService
      .getAllColor(this.offset, this.limit, this.status)
      .subscribe((res) => {
        this.datas = res.data.items;
        this.Page = res.data;
      });
  }

  addColor(color: ColorDTO) {
    if (this.formColor.valid) {
      this.addValueColor();
      this.colorService.createColor(color).subscribe(
        (res) => {
          this.getAllColor();
          this.message.success('Thêm dữ liệu thành công');
          this.isVisible = false;
        },
        (error) => {
          this.message.error('Thêm dữ liệu thất bại');
        }
      );
    }
  }

  updateColor() {
    if (this.formColor.valid) {
      this.addValueColor();
      this.colorService.updateColor(this.color).subscribe(
        (res) => {
          this.getAllColor();
          this.message.success('Cập nhật dữ liệu thành công');
          this.isVisible = false;
          return;
        },
        (error) => {
          this.message.error('Cập nhật dữ liệu thất bại');
        }
      );
    }
    return;
  }

  deleteColor(id: any) {
    this.colorService.deleteColor(id).subscribe(
      (res) => {
        this.datas.forEach((value) => {
          if (value.id == id) {
            value.status = 0;
            return;
          }
          this.message.success('Xóa dữ liệu thành công');
        });
      },
      (error) => {
        this.message.error('Xóa dữ liệu thất bại');
      }
    );
  }

  getInfoColor(id: any) {
    this.showModal();
    const colorID = this.datas.find((value) => {
      return value.id == id;
    });
    if (colorID) {
      this.color = colorID;
    }
    this.fillValueForm();
  }

  addValueColor() {
    this.color.id = this.formColor.value.id;
    this.color.colorCode = this.formColor.value.colorCode;
    this.color.colorName = this.formColor.value.colorName;
    this.color.status = this.formColor.value.status;
  }

  fillValueForm() {
    this.formColor.patchValue({
      id: this.color.id,
      colorCode: this.color.colorCode,
      colorName: this.color.colorName,
      status: this.color.status,
    });
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: [''],
    });
  }

  pageItem(pageItems: any) {
    this.limit = pageItems;
    this.pagination(this.offset);
  }

  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset;
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
  }

  timkiem() {
    this.searchWithPage(0);
    this.initFormSearch();
  }
}
