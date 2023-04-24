import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../common-services/auth.service';
import {
  EmailOrPhoneNumber,
  PasswordValidator,
} from '../validators/input.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin!: UntypedFormGroup;
  submit = false;
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      phoneOrEmail: ['', Validators.compose([EmailOrPhoneNumber()])],
      password: ['', Validators.compose([PasswordValidator()])],
      remember: [true],
    });
  }

  loginForm() {
    this.submit = true;
    if (this.formLogin.valid) {
      this.authService.login({
        phoneOrEmail: this.formLogin.value.phoneOrEmail,
        password: this.formLogin.value.password,
      });
    } else {
      Object.values(this.formLogin.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
