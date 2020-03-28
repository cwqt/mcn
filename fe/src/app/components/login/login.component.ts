import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading:boolean = false;
  success:boolean = false;

  constructor(
    private authService:AuthenticationService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [ Validators.required ]],
      password: ["", [ Validators.required, ]],
      rememberMe: [false],
    });
  }

  get email() { return this.loginForm.get("email") }
  get password() { return this.loginForm.get("password") }

  submitHandler() {
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.success = true;
      },
      err => {
        this.success = false;
      },
      () => { this.loading = false; }
    )
  }
}
