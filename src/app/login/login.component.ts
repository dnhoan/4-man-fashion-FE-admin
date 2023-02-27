import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../common-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      phoneOrEmail: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  loginForm() {
    if (this.formLogin.valid) {
      console.log('submit', this.formLogin.value);
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
