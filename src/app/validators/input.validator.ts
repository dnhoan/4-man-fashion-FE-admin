import { AbstractControl, ValidatorFn } from '@angular/forms';

export function EmailOrPhoneNumber(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let controlVal = control.value;

    let r_phone_number = new RegExp(/(0[3|5|7|8|9])+([0-9]{8})\b/);
    let r_email = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if ((controlVal || '').trim().length === 0) {
      return { account: 'Chưa email hoặc số điện thoại' };
    }
    if ((controlVal || '').trim().length > 225) {
      return { account: 'Email hoặc số điện thoại dưới 225 ký tự' };
    }
    if (r_email.test(controlVal) || r_phone_number.test(controlVal))
      return null;

    if (!r_email.test(controlVal)) {
      return { account: 'Sai định dạng email hoặc số điện thoại' };
    }
    if (!r_phone_number.test(controlVal)) {
      return { account: 'Sai định dạng email hoặc số điện thoại' };
    }

    return null;
  };
}
export function PasswordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log(control);

    let controlVal = control.value;

    let r_password = new RegExp(/^[a-zA-Z0-9]+$/);

    if ((controlVal || '').trim().length < 6) {
      return { password: 'Mật khẩu tối thiểu 6 ký tự' };
    }
    if ((controlVal || '').trim().length > 225) {
      return { password: 'Mật khẩu dưới 225 ký tự' };
    }
    if (!r_password.test(controlVal)) {
      return { password: 'Mật khẩu với định dạng a-z, A-Z, 0-9' };
    }

    return null;
  };
}
export function ProductNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let controlVal = control.value;

    if ((controlVal || '').trim().length === 0) {
      return { productName: 'Chưa nhập tên sản phẩm' };
    }

    // if ((controlVal || '').trim().length < 20) {
    //   return { productName: 'Tên sản phẩm tối thiểu 20 ký tự' };
    // }
    if ((controlVal || '').trim().length > 225) {
      return { productName: 'Tên sản phẩm tối đa 225 ký tự' };
    }
    return null;
  };
}
